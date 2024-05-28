import { Injectable } from '@nestjs/common';

import { CreateAuthDto, SignInAuthDto } from './dtos';

@Injectable()
export class AuthService {
  signUp(createAuthDto: CreateAuthDto) {
    // TODO: hash password

    // TODO: generate access token

    // TODO: generate refresh token
    return 'Sign up successfully';
  }

  signIn(signInAuthDto: SignInAuthDto) {
    // TODO: match email and password

    // TODO: generate access token

    // TODO: generate refresh token

    return 'Sign in successfully';
  }

  signOut(email: string) {
    // TODO: remove refresh token

    return `Remove refresh token for ${email}`;
  }

  refreshToken() {
    // TODO: generate new access token

    return `This action refreshes token`;
  }
}
