import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  password?: string;

}
