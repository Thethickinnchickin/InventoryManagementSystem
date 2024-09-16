import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class StockLevelReportDto {
  @ApiPropertyOptional({
    description: 'The category to filter the stock levels report',
    type: String,
    example: 'Electronics',
  })
  @IsOptional()
  @IsString()
  category?: string;
}
