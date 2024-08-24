import { IsOptional, IsDate } from 'class-validator';

export class FinancialSummaryReportDto {
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;
}
