import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Member } from './entities/member.entity';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { Book } from '../book/entities/book.entity';
import { Borrow } from '../borrow/entities/borrow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Book, Borrow])],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
