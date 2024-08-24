import { IsString, IsOptional, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 255)
  username: string;

  @IsString()
  @Length(6, 255)
  password: string;

  @IsOptional()
  @IsEmail()
  @Length(0, 255)
  email?: string;
}
