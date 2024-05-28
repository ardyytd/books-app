import { Test, TestingModule } from '@nestjs/testing';

import { MemberController } from '../member.controller';
import { MemberService } from '../member.service';

describe('MemberController', () => {
  let controller: MemberController;

  const memberServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [
        {
          provide: MemberService,
          useValue: memberServiceMock,
        },
      ],
    }).compile();

    controller = module.get<MemberController>(MemberController);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('controller should have methods', () => {
    it('create', () => {
      expect(controller.create).toBeDefined();
    });

    it('findAll', () => {
      expect(controller.findAll).toBeDefined();
    });

    it('findOne', () => {
      expect(controller.findOne).toBeDefined();
    });

    it('update', () => {
      expect(controller.update).toBeDefined();
    });

    it('remove', () => {
      expect(controller.remove).toBeDefined();
    });
  });

  describe('controller methods should call service methods', () => {
    it('create', () => {
      controller.create({
        code: 'code',
        name: 'name',
      });

      expect(memberServiceMock.create).toHaveBeenCalledTimes(1);
    });

    it('findAll', () => {
      controller.findAll();

      expect(memberServiceMock.findAll).toHaveBeenCalledTimes(1);
    });

    it('findOne', () => {
      controller.findOne('1');

      expect(memberServiceMock.findOne).toHaveBeenCalledTimes(1);
    });

    it('update', () => {
      controller.update('1', {
        code: 'code',
        name: 'name',
      });

      expect(memberServiceMock.update).toHaveBeenCalledTimes(1);
    });

    it('remove', () => {
      controller.remove('1');

      expect(memberServiceMock.remove).toHaveBeenCalledTimes(1);
    });
  });
});
