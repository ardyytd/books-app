import { DataSource } from 'typeorm';

import { Auth } from '../api/auth/entities/auth.entity';
import { Member } from '../api/member/entities/member.entity';
import { Book } from '../api/book/entities/book.entity';
import { Borrow } from '../api/borrow/entities/borrow.entity';

// TODO: load from .env file based on NODE_ENV
const dataSourse = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 9876,
  username: 'local',
  password: 'local',
  database: 'books_app_local',
  migrations: ['src/databases/migrations/*.ts'],

  // don't fully support string patern maching like nest/typeorm does ('src/**/*.entity.ts')
  // TODO: find a way to support this. Import one by one is horrible
  entities: [Auth, Member, Book, Borrow],
});

export default dataSourse;
