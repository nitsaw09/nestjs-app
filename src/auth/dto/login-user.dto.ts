import { PartialType, OmitType } from '@nestjs/mapped-types';
import { RegisterUserDto } from './register-user.dto';

export class LoginUserDto extends PartialType(
  OmitType(RegisterUserDto, ['name'] as const),
) {}
