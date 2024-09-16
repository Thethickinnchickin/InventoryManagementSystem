import { IsOptional, IsString, IsDate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class OrderHistoryReportDto {
  @ApiPropertyOptional({
    description: 'The start date for the order history report',
    type: String,
    format: 'date-time',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'The end date for the order history report',
    type: String,
    format: 'date-time',
    example: '2023-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'The name of the customer to filter the order history report',
    type: String,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  customerName?: string;
}
