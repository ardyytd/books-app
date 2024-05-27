import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
  });

  afterAll(async () => {
    await app.close();
  });

  it('app should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should load .env file', () => {
    expect(process.env.NODE_ENV).toBeDefined();
    expect(process.env.DATABASE_URL).toBeDefined();
  });

  it('should connect to database', () => {
    const dataSource = app.get(DataSource);

    expect(dataSource).toBeDefined();
    expect(dataSource.isInitialized).toBeTruthy();
  });
});
