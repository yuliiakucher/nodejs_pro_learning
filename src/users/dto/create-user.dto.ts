import { RoleEnum } from '../users.service';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(RoleEnum, { message: 'not supported role' })
  role: RoleEnum;
}
