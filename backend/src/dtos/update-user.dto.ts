import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The new username of the user.',
    type: String,
    example: 'newUsername',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The new password for the user. Leave empty if not updating.',
    type: String,
    example: 'newPassword123',
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;
}
