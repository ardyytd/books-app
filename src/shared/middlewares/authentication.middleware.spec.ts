import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { IncomingMessage } from 'http';

import { AuthenticationMiddleware } from './authentication.middleware';

describe('AuthenticationMiddleware', () => {
  let middleware: AuthenticationMiddleware;
  let dataSource: DataSource;
  let repository: Repository<any>;

  beforeEach(async () => {
    const mockRepository = {
      exists: jest.fn(),
    };

    const mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationMiddleware,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    middleware = module.get(AuthenticationMiddleware);
    dataSource = module.get(DataSource);
    repository = dataSource.getRepository('auths');
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should throw UnauthorizedException if token is not found', async () => {
    const req = { headers: {} } as IncomingMessage;
    const next = jest.fn();

    await expect(middleware.use(req, null, next)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    const req = {
      headers: { authorization: 'Bearer invalid-token' },
    } as IncomingMessage;
    const next = jest.fn();

    jest.spyOn(repository, 'exists').mockResolvedValue(false);

    await expect(middleware.use(req, null, next)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if token is valid', async () => {
    const req = {
      headers: { authorization: 'Bearer valid-token' },
    } as IncomingMessage;
    const next = jest.fn();

    jest.spyOn(repository, 'exists').mockResolvedValue(true);

    await middleware.use(req, null, next);

    expect(next).toHaveBeenCalled();
  });
});
