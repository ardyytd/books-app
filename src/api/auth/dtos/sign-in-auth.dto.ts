import { OmitType } from '@nestjs/swagger';

import { CreateAuthDto } from './create-auth.dto';

export class SignInAuthDto extends OmitType(CreateAuthDto, [
  'passwordConfirmation',
]) {}
