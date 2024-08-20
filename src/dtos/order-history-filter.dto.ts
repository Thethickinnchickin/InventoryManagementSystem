import { IsOptional, IsString, IsDateString, IsNumberString } from 'class-validator';

export class OrderHistoryFilterDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsNumberString()
  minTotalAmount?: string;

  @IsOptional()
  @IsNumberString()
  maxTotalAmount?: string;
}
