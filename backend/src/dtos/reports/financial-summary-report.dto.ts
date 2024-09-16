import { IsOptional, IsDate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FinancialSummaryReportDto {
  @IsOptional()
  @IsDate()
  @ApiPropertyOptional({
    description: 'Start date for the financial summary report',
    type: String,
    format: 'date-time',
    example: '2024-01-01T00:00:00Z',
  })
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @ApiPropertyOptional({
    description: 'End date for the financial summary report',
    type: String,
    format: 'date-time',
    example: '2024-12-31T23:59:59Z',
  })
  endDate?: Date;
}
