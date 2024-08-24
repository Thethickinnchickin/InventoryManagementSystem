import { IsOptional, IsString } from 'class-validator';

export class StockLevelReportDto {
  @IsOptional()
  @IsString()
  category?: string;
}
