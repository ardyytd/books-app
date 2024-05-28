import { OmitType } from '@nestjs/mapped-types';

import { CreateAuthDto } from './create-auth.dto';

export class SignInAuthDto extends OmitType(CreateAuthDto, [
  'passwordConfirmation',
]) {}
