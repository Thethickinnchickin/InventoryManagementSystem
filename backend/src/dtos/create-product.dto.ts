import { IsNotEmpty, IsString, IsInt, Min, MaxLength, IsOptional, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'price must be a number with up to 2 decimal places' })
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsNumber({}, { each: true })
  @IsOptional()
  categoryIds?: number[];
}
