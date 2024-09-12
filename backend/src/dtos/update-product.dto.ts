import { IsString, IsOptional, IsDecimal, IsInt, MinLength, Min, IsNumber } from 'class-validator';
import { Int32 } from 'typeorm';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({maxDecimalPlaces: 2})
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsNumber({}, { each: true })
  @IsOptional()
  categoryIds?: number[];

}
