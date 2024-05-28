import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
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

    it('refreshToken', () => {
      expect(service.refreshToken).toBeDefined();
    });
  });
});
