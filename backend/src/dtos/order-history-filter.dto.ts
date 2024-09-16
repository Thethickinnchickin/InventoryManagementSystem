import { IsOptional, IsString, IsDateString, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderHistoryFilterDto {
  @ApiProperty({
    description: 'The start date for filtering orders',
    type: String,
    format: 'date-time',
    required: false,
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'The end date for filtering orders',
    type: String,
    format: 'date-time',
    required: false,
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'The name of the customer to filter orders by',
    type: String,
    required: false,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiProperty({
    description: 'Minimum total amount for filtering orders',
    type: String,
    required: false,
    example: '100',
  })
  @IsOptional()
  @IsNumberString()
  minTotalAmount?: string;

  @ApiProperty({
    description: 'Maximum total amount for filtering orders',
    type: String,
    required: false,
    example: '500',
  })
  @IsOptional()
  @IsNumberString()
  maxTotalAmount?: string;
}
