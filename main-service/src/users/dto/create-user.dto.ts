import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsArray()
  @IsUUID('4', { each: true })
  roleIds: string[];

  @IsString()
  @IsNotEmpty()
  password: string;
}
