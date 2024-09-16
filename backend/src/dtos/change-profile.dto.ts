import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'The new password for the user',
    type: String,
    example: 'NewP@ssw0rd!',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Confirmation of the new password',
    type: String,
    example: 'NewP@ssw0rd!',
  })
  @IsString()
  confirmPassword: string;
}

export class ChangeUsernameDto {
  @ApiProperty({
    description: 'The new username for the user',
    type: String,
    example: 'newUsername123',
  })
  @IsString()
  username: string;
}
