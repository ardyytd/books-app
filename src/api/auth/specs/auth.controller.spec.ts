import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const authService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    refreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('controller should have methods', () => {
    it('signUp', () => {
      expect(controller.signUp).toBeDefined();
    });

    it('signIn', () => {
      expect(controller.signIn).toBeDefined();
    });

    it('signOut', () => {
      expect(controller.signOut).toBeDefined();
    });
  });

  describe('controller methods should call service methods', () => {
    it('signUp', () => {
      controller.signUp({
        email: 'test@mail.com',
        password: 'password',
        passwordConfirmation: 'password',
      });

      expect(authService.signUp).toHaveBeenCalledTimes(1);
    });

    it('signIn', () => {
      controller.signIn({
        email: 'test@mail.com',
        password: 'password',
      });

      expect(authService.signIn).toHaveBeenCalledTimes(1);
    });

    it('signOut', () => {
      controller.signOut({ email: 'mail@mail.com' });
      expect(authService.signOut).toHaveBeenCalledTimes(1);
    });
  });
});
