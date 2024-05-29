import { HttpException, Injectable } from '@nestjs/common';
import { Not, Repository, DataSource, QueryRunner, IsNull } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { CreateMemberDto, UpdateMemberDto } from './dtos';
import { Member } from './entities/member.entity';
import { Book } from '../book/entities/book.entity';
import { Borrow } from '../borrow/entities/borrow.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(Borrow) private borrowRepository: Repository<Borrow>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(createMemberDto: CreateMemberDto) {
    const isCodeExist = await this.memberRepository.exists({
      where: { code: createMemberDto.code },
    });
    if (isCodeExist) {
      throw new HttpException('Code already exists', 400);
    }

    return this.memberRepository.save(createMemberDto);
  }

  findAll() {
    // TODO: determine the upper and lower limit of the number of members to be taken
    return this.memberRepository.find();
  }

  async findOne(id: number) {
    const member = await this.memberRepository.findOne({ where: { id } });
    if (!member) {
      throw new HttpException('Member not found', 404);
    }

    return member;
  }

  async update(id: number, updateMemberDto: UpdateMemberDto) {
    const member = await this.memberRepository.findOne({ where: { id } });
    if (!member) {
      throw new HttpException('Member not found', 404);
    }

    const updatedMember = {
      ...member,
      ...updateMemberDto,
    };

    const isCodeAlreadyUsed = await this.memberRepository.exists({
      where: { code: updateMemberDto.code, id: Not(id) },
    });
    if (isCodeAlreadyUsed) {
      throw new HttpException('Code already used', 400);
    }

    await this.memberRepository.update(id, { ...member, ...updateMemberDto });

    return updatedMember;
  }

  async remove(id: number) {
    const member = await this.memberRepository.findOne({ where: { id } });
    if (!member) {
      throw new HttpException('Member not found', 404);
    }

    await this.memberRepository.delete(id);

    return member;
  }

  // --- The core task ---

  async borrowBook(memberId: number, bookId: number) {
    // Atomicity is ensured by using a transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const member = await queryRunner.manager.findOne(Member, {
        where: { id: memberId },
        // Locking the data to prevent race conditions
        lock: { mode: 'pessimistic_read' },
      });
      if (!member) {
        throw new HttpException('Member not found', 404);
      }

      // Member is currently not being penalized
      if (member.isPenalized) {
        throw new HttpException('Member is being penalized', 400);
      }

      const book = await queryRunner.manager.findOne(Book, {
        where: { id: bookId },
        lock: { mode: 'pessimistic_read' },
      });
      if (!book) {
        throw new HttpException('Book not found', 404);
      }

      if (book.stock < 1) {
        throw new HttpException('Book out of stock', 400);
      }

      const totalBorrows = await queryRunner.manager.count(Borrow, {
        where: { member, returnedAt: null },
      });
      if (totalBorrows >= 2) {
        throw new HttpException('Maximum borrow limit reached', 400);
      }

      // Borrowed books are not borrowed by other members
      const isBookBorrowed = await queryRunner.manager.findOne(Borrow, {
        where: { book, returnedAt: null },
        lock: { mode: 'pessimistic_read' },
      });
      if (isBookBorrowed) {
        throw new HttpException('Book is currently being borrowed', 400);
      }

      // Decrement the stock of the book
      book.stock -= 1;
      await queryRunner.manager.save(book);

      const borrowBook = this.borrowRepository.create({
        member: { id: memberId },
        book: { id: bookId },
        borrowedAt: new Date(),
      });
      await queryRunner.manager.save(borrowBook);

      await queryRunner.commitTransaction();

      return borrowBook;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async returnBook(memberId: number, bookId: number) {
    // Atomicity is ensured by using a transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const member = await queryRunner.manager.findOne(Member, {
        where: { id: memberId },
        lock: { mode: 'pessimistic_read' },
      });
      if (!member) {
        throw new HttpException('Member not found', 404);
      }

      const book = await queryRunner.manager.findOne(Book, {
        where: { id: bookId },
        lock: { mode: 'pessimistic_read' },
      });
      if (!book) {
        throw new HttpException('Book not found', 404);
      }

      const borrowBook = await queryRunner.manager.findOne(Borrow, {
        where: { member, book, returnedAt: IsNull() },
        lock: { mode: 'pessimistic_write' },
      });
      if (!borrowBook) {
        throw new HttpException('Book not being borrowed', 400);
      }

      borrowBook.returnedAt = new Date();
      await queryRunner.manager.save(borrowBook);

      // Calculate the difference between the current date and the date the book was borrowed
      const borrowedAt = new Date(borrowBook.borrowedAt);
      const returnedAt = new Date(borrowBook.returnedAt);
      const diffDays = this.calculateDaysBetweenDates(borrowedAt, returnedAt);
      const isLate = this.isReturnLate(diffDays, 7);

      if (isLate) {
        await this.penalizeMember(queryRunner, member, 3);
      }

      // Increment the stock of the book
      book.stock += 1;
      await queryRunner.manager.save(book);

      await queryRunner.commitTransaction();

      return borrowBook;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // utility function
  private calculateDaysBetweenDates(startDate: Date, endDate: Date): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private isReturnLate(diffDays: number, allowedDays: number): boolean {
    return diffDays > allowedDays;
  }

  private async penalizeMember(
    queryRunner: QueryRunner,
    member: Member,
    penaltyDays: number,
  ) {
    const penaltyMilliseconds = penaltyDays * 24 * 60 * 60 * 1000;

    if (member.isPenalized) {
      member.penaltyEndDate = new Date(
        member.penaltyEndDate.getTime() + penaltyMilliseconds,
      );
    } else {
      member.isPenalized = true;
      member.penaltyEndDate = new Date(Date.now() + penaltyMilliseconds);
    }

    await queryRunner.manager.save(member);
  }
}
