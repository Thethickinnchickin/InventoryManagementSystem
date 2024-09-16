import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'The name of the category to be updated',
    type: String,
    example: 'Electronics',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
