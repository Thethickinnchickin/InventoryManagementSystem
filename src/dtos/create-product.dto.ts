// src/products/dto/create-product.dto.ts
import { IsNotEmpty, IsString, IsDecimal, IsInt, Min, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDecimal()
  price: number;

  @IsInt()
  @Min(0)
  stock: number;
}
