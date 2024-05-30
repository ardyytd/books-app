import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AuthService } from '../auth.service';
import { Auth } from '../entities/auth.entity';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Auth),
          useValue: Repository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('service should have methods', () => {
    it('signUp', () => {
      expect(service.signUp).toBeDefined();
    });

    it('signIn', () => {
      expect(service.signIn).toBeDefined();
    });

    it('signOut', () => {
      expect(service.signOut).toBeDefined();
    });
  });
});
