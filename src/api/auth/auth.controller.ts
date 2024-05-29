import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateAuthDto, SignInAuthDto } from './dtos';
import { SignOutAuthDto } from './dtos/sign-out-auth.dto copy';

@Controller('auth')
@UsePipes(ValidationPipe)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signUp(createAuthDto);
  }

  @Post('sign-in')
  signIn(@Body() signInAuthDto: SignInAuthDto) {
    return this.authService.signIn(signInAuthDto);
  }

  @ApiBody({ schema: { example: { email: '' } } })
  @Post('sign-out')
  signOut(@Body() signOutAuthDto: SignOutAuthDto) {
    return this.authService.signOut(signOutAuthDto.email);
  }
}
