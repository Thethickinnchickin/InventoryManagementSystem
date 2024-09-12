import { IsString, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  password: string;

  @IsString()
  confirmPassword: string;
}

export class ChangeUsernameDto {
  @IsString()
  username: string;
}
