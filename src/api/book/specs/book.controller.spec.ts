import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from '../book.controller';
import { BookService } from '../book.service';

describe('BookController', () => {
  let controller: BookController;

  const bookServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: bookServiceMock,
        },
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('controller methods should call service methods', () => {
    it('create', () => {
      controller.create({} as any);

      expect(bookServiceMock.create).toBeCalledTimes(1);
    });

    it('findAll', () => {
      controller.findAll();

      expect(bookServiceMock.findAll).toBeCalledTimes(1);
    });

    it('findOne', () => {
      controller.findOne(1);

      expect(bookServiceMock.findOne).toBeCalledTimes(1);
    });

    it('update', () => {
      controller.update(1, {} as any);

      expect(bookServiceMock.update).toBeCalledTimes(1);
    });

    it('remove', () => {
      controller.remove(1);

      expect(bookServiceMock.remove).toBeCalledTimes(1);
    });
  });
});
