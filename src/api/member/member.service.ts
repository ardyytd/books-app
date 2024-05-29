import { HttpException, Injectable } from '@nestjs/common';
import { Not, Repository, DataSource } from 'typeorm';
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
}
