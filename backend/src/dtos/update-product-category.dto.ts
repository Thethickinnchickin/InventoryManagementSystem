import { IsString, IsOptional, IsInt, MinLength, Min, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductCategoryDto {
  @ApiProperty({
    description: 'The name of the product category',
    type: String,
    minLength: 1,
    example: 'Electronics',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiProperty({
    description: 'The description of the product category',
    type: String,
    example: 'Devices and gadgets related to electronics',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The price of the product',
    type: Number,
    example: 299.99,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'price must be a valid number with up to 2 decimal places' })
  price?: number;

  @ApiProperty({
    description: 'The stock quantity of the product',
    type: Number,
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiProperty({
    description: 'List of category IDs associated with the product',
    type: [Number],
    example: [1, 2, 3],
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  categoryIds?: number[];
}
