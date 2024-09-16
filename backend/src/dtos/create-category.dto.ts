import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    type: String,
    maxLength: 255,
    example: 'Electronics',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;
}
