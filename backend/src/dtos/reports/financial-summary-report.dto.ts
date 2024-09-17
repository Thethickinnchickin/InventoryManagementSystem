import { IsOptional, IsDate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for the Financial Summary Report.
 * Used to validate and document the input for generating financial summaries.
 */
export class FinancialSummaryReportDto {
  /**
   * Optional start date for the financial summary report.
   * @example '2024-01-01T00:00:00Z'
   */
  @IsOptional() // Indicates that this field is optional
  @IsDate() // Validates that the field, if provided, must be a valid date
  @ApiPropertyOptional({
    description: 'Start date for the financial summary report',
    type: String, // The date is represented as a string in the API documentation
    format: 'date-time', // Specifies the format of the date string
    example: '2024-01-01T00:00:00Z', // Example of the date format
  })
  startDate?: Date; // Field to hold the start date of the report

  /**
   * Optional end date for the financial summary report.
   * @example '2024-12-31T23:59:59Z'
   */
  @IsOptional() // Indicates that this field is optional
  @IsDate() // Validates that the field, if provided, must be a valid date
  @ApiPropertyOptional({
    description: 'End date for the financial summary report',
    type: String, // The date is represented as a string in the API documentation
    format: 'date-time', // Specifies the format of the date string
    example: '2024-12-31T23:59:59Z', // Example of the date format
  })
  endDate?: Date; // Field to hold the end date of the report
}
