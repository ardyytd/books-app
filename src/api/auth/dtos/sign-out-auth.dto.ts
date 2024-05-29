import { PickType } from '@nestjs/swagger';

import { CreateAuthDto } from './create-auth.dto';

export class SignOutAuthDto extends PickType(CreateAuthDto, ['email']) {}
