import { HttpException, Injectable } from '@nestjs/common';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateAuthDto, SignInAuthDto } from './dtos';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
  ) {}

  async signUp(createAuthDto: CreateAuthDto) {
    const user = await this.authRepository.findOne({
      where: {
        email: createAuthDto.email,
      },
    });
    if (user) {
      throw new HttpException('User already exists', 409);
    }

    const hashedPassword = this.hashPassword(createAuthDto.password);

    // For better security generate refresh token and store it in the database
    // But for now keep it simple
    const accessToken = randomBytes(16).toString('hex');

    await this.authRepository.save({
      ...createAuthDto,
      password: hashedPassword,
      accessToken,
    });

    return accessToken;
  }

  async signIn(signInAuthDto: SignInAuthDto) {
    const user = await this.authRepository.findOne({
      where: {
        email: signInAuthDto.email,
      },
    });
    if (!user) {
      throw new HttpException(
        'Make sure your email and password are correct',
        401,
      );
    }

    if (!this.comparePassword(signInAuthDto.password, user.password)) {
      throw new HttpException(
        'Make sure your email and password are correct',
        401,
      );
    }

    const accessToken = randomBytes(16).toString('hex');

    await this.authRepository.update(user.id, {
      accessToken,
    });

    return accessToken;
  }

  async signOut(email: string) {
    const user = await this.authRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    await this.authRepository.update(user.id, {
      accessToken: null,
    });

    return email;
  }

  hashPassword(rawPassword: string) {
    const hash = pbkdf2Sync(
      rawPassword,
      process.env.PASSWORD_SALT,
      1000,
      64,
      'sha512',
    ).toString('hex');

    return `${process.env.PASSWORD_SALT}:${hash}`;
  }

  comparePassword(rawPassword: string, hashedPassword: string) {
    const [salt, originalHash] = hashedPassword.split(':');
    const hash = pbkdf2Sync(rawPassword, salt, 1000, 64, 'sha512').toString(
      'hex',
    );

    return hash === originalHash;
  }
}
