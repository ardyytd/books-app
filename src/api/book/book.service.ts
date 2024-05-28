import { HttpException, Injectable } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateBookDto, UpdateBookDto } from './dtos';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const isCodeExist = await this.bookRepository.findOne({
      where: { code: createBookDto.code },
    });
    if (isCodeExist) {
      throw new HttpException('Code already exist', 400);
    }

    const book = await this.bookRepository.save(createBookDto);

    return book;
  }

  findAll() {
    return this.bookRepository.find();
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new HttpException('Book not found', 404);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new HttpException('Book not found', 404);
    }

    const updatedBook = {
      ...book,
      ...updateBookDto,
    };

    const isCodeAlreadyUsed = await this.bookRepository.exists({
      where: { code: updatedBook.code, id: Not(id) },
    });
    if (isCodeAlreadyUsed) {
      throw new HttpException('Code already used', 400);
    }

    await this.bookRepository.update(id, updatedBook);

    return updatedBook;
  }

  async remove(id: number) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new HttpException('Book not found', 404);
    }

    await this.bookRepository.delete(id);

    return book;
  }
}
