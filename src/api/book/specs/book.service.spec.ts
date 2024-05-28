import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { BookService } from '../book.service';
import { Book } from '../entities/book.entity';

describe('BookService', () => {
  let service: BookService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useClass: class {},
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('book service should operate correctly', () => {
    describe('create', () => {
      it('should create a book', async () => {
        const book = {
          code: 'code',
          title: 'title',
          author: 'author',
          stock: 1,
        } as Book;

        jest.spyOn(service, 'create').mockResolvedValue(book);
        expect(await service.create(book)).toBe(book);
      });

      it('should throw an error if the code already exists', async () => {
        const book = {
          code: 'code',
          title: 'title',
          author: 'author',
          stock: 1,
        } as Book;

        jest
          .spyOn(service, 'create')
          .mockRejectedValue(new Error('Code already exists'));

        await expect(service.create(book)).rejects.toThrowError(
          'Code already exists',
        );
      });
    });

    describe('findAll', () => {
      it('should return all books', async () => {
        const books = [
          {
            code: 'code',
            title: 'title',
            author: 'author',
            stock: 1,
          },
        ] as Book[];

        jest.spyOn(service, 'findAll').mockResolvedValue(books);
        expect(await service.findAll()).toBe(books);
      });
    });

    describe('findOne', () => {
      it('should return a book', async () => {
        const book = {
          code: 'code',
          title: 'title',
          author: 'author',
          stock: 1,
        } as Book;

        jest.spyOn(service, 'findOne').mockResolvedValue(book);
        expect(await service.findOne(1)).toBe(book);
      });

      it('should throw an error if the book does not exist', async () => {
        jest
          .spyOn(service, 'findOne')
          .mockRejectedValue(new Error('Book not found'));

        await expect(service.findOne(1)).rejects.toThrowError('Book not found');
      });
    });

    describe('update', () => {
      const book = {
        id: 1,
        code: 'code',
        title: 'title',
        author: 'author',
        stock: 1,
      } as Book;

      it('should update a book', async () => {
        jest.spyOn(service, 'update').mockResolvedValue(book);
        expect(await service.update(book.id, book)).toBe(book);
      });

      it('should throw an error if the book does not exist', async () => {
        jest
          .spyOn(service, 'update')
          .mockRejectedValue(new Error('Book not found'));

        await expect(service.update(book.id, book)).rejects.toThrowError(
          'Book not found',
        );
      });

      it('should throw an error if the code is already used', async () => {
        jest
          .spyOn(service, 'update')
          .mockRejectedValue(new Error('Code already used'));

        await expect(service.update(book.id, book)).rejects.toThrowError(
          'Code already used',
        );
      });
    });

    describe('remove', () => {
      it('should remove a book', async () => {
        const book = {
          code: 'code',
          title: 'title',
          author: 'author',
          stock: 1,
        } as Book;

        jest.spyOn(service, 'remove').mockResolvedValue(book);
        expect(await service.remove(1)).toBe(book);
      });

      it('should throw an error if the book does not exist', async () => {
        jest
          .spyOn(service, 'remove')
          .mockRejectedValue(new Error('Book not found'));

        await expect(service.remove(1)).rejects.toThrowError('Book not found');
      });
    });
  });
});
