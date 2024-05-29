import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { MemberModule } from './member/member.module';
import { BookModule } from './book/book.module';
import { BorrowModule } from './borrow/borrow.module';

@Module({
  imports: [AuthModule, MemberModule, BookModule, BorrowModule],
  controllers: [],
  providers: [],
})
export class ApiModule {}
