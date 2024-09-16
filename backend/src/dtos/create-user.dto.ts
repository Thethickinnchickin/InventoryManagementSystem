import { IsString, IsOptional, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'The username of the user',
    type: String,
    minLength: 3,
    maxLength: 255,
    example: 'john_doe',
  })
  @IsString()
  @Length(3, 255)
  username: string;

  @ApiProperty({
    description: 'The password for the user account',
    type: String,
    minLength: 6,
    maxLength: 255,
    example: 'securePassword123',
  })
  @IsString()
  @Length(6, 255)
  password: string;

  @ApiProperty({
    description: 'The role assigned to the user',
    enum: UserRole,
    required: false,
    example: UserRole.USER,
  })
  @IsOptional()
  role?: UserRole; // 'user' or 'admin'
}
