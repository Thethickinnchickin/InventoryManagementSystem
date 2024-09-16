import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'The new username of the user.',
    type: String,
    example: 'newUsername',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'The new email address of the user.',
    type: String,
    example: 'user@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}
