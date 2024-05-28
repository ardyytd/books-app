import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiModule } from './api';
import { MemberModule } from './api/member/member.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // TODO: this is dangerous in production, will change it by use the migrations
        url: configService.get('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    ApiModule,
    MemberModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
