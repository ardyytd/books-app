import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { MemberModule } from './member/member.module';
import { BookModule } from './book/book.module';
import { BorrowModule } from './borrow/borrow.module';
import { AuthenticationMiddleware } from '../shared/middlewares';

@Module({
  imports: [AuthModule, MemberModule, BookModule, BorrowModule],
  controllers: [],
  providers: [],
})
export class ApiModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude(
        { path: 'auth/sign-up', method: RequestMethod.POST },
        { path: 'auth/sign-in', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
