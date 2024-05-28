import { HttpException, Injectable } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateMemberDto, UpdateMemberDto } from './dtos';
import { Member } from './entities/member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
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
}
