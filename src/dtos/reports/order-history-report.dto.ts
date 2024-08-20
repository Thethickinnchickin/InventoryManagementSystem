import { IsOptional, IsString, IsDate } from 'class-validator';

export class OrderHistoryReportDto {
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsString()
  customerName?: string;
}
