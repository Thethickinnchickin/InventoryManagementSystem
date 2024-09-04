import { IsString, IsOptional, IsEmail, Length } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @Length(3, 255)
  username: string;

  @IsString()
  @Length(6, 255)
  password: string;

  @IsOptional()
  role: UserRole; // 'user' or 'admin'
}
