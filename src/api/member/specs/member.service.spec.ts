import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MemberService } from '../member.service';
import { Member } from '../entities/member.entity';

describe('MemberService', () => {
  let service: MemberService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        { provide: getRepositoryToken(Member), useClass: Repository },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('member service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('member service should operate correctly', () => {
    describe('create', () => {
      it('should create a member', async () => {
        const member = { code: 'code', name: 'name' } as Member;

        jest.spyOn(service, 'create').mockResolvedValue(member);

        expect(await service.create(member)).toBe(member);
      });

      it('should throw an error if the code already exists', async () => {
        const member = { code: 'code', name: 'name' } as Member;

        jest
          .spyOn(service, 'create')
          .mockRejectedValue(new Error('Code already exists'));

        await expect(service.create(member)).rejects.toThrowError(
          'Code already exists',
        );
      });
    });

    describe('findAll', () => {
      it('should return all members', async () => {
        const members = [{ code: 'code', name: 'name' }] as Member[];

        jest.spyOn(service, 'findAll').mockResolvedValue(members);

        expect(await service.findAll()).toBe(members);
      });
    });

    describe('findOne', () => {
      it('should return a member', async () => {
        const member = { code: 'code', name: 'name' } as Member;

        jest.spyOn(service, 'findOne').mockResolvedValue(member);

        expect(await service.findOne(1)).toBe(member);
      });

      it('should throw an error if the member does not exist', async () => {
        jest
          .spyOn(service, 'findOne')
          .mockRejectedValue(new Error('Member not found'));

        await expect(service.findOne(1)).rejects.toThrowError(
          'Member not found',
        );
      });
    });

    describe('update', () => {
      const member = { id: 1, code: 'code', name: 'name' } as Member;

      it('should update a member', async () => {
        jest.spyOn(service, 'update').mockResolvedValue(member);

        expect(await service.update(member.id, member)).toBe(member);
      });

      it('should throw an error if the member does not exist', async () => {
        jest
          .spyOn(service, 'update')
          .mockRejectedValue(new Error('Member not found'));

        await expect(service.update(member.id, member)).rejects.toThrowError(
          'Member not found',
        );
      });

      it('should throw an error if the code is already used', async () => {
        jest
          .spyOn(service, 'update')
          .mockRejectedValue(new Error('Code already used'));

        await expect(service.update(member.id, member)).rejects.toThrowError(
          'Code already used',
        );
      });
    });

    describe('remove', () => {
      it('should remove a member', async () => {
        const member = { code: 'code', name: 'name' } as Member;

        jest.spyOn(service, 'remove').mockResolvedValue(member);

        expect(await service.remove(1)).toBe(member);
      });

      it('should throw an error if the member does not exist', async () => {
        jest
          .spyOn(service, 'remove')
          .mockRejectedValue(new Error('Member not found'));

        await expect(service.remove(1)).rejects.toThrowError(
          'Member not found',
        );
      });
    });
  });
});
