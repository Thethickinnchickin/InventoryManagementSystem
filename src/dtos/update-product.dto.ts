import { IsString, IsOptional, IsDecimal, IsInt, MinLength, Min } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDecimal({ decimal_digits: '2' })
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;
}
