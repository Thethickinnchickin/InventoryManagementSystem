import { IsString, IsOptional, IsDecimal, IsInt, MinLength, Min, IsNumber } from 'class-validator';

export class UpdateProductCategoryDto {
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
