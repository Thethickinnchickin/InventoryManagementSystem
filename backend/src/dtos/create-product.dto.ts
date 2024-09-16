import { IsNotEmpty, IsString, IsInt, Min, MaxLength, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    type: String,
    maxLength: 255,
    example: 'Sample Product',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'A brief description of the product',
    type: String,
    example: 'This is a sample product description.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The price of the product, must be a valid number with up to 2 decimal places',
    type: Number,
    example: 19.99,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'price must be a number with up to 2 decimal places' })
  price: number;

  @ApiProperty({
    description: 'The stock quantity of the product',
    type: Number,
    example: 100,
  })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({
    description: 'Optional list of category IDs associated with the product',
    type: [Number],
    required: false,
    example: [1, 2, 3],
  })
  @IsNumber({}, { each: true })
  @IsOptional()
  categoryIds?: number[];
}
