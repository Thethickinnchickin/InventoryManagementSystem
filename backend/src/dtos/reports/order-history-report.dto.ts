import { IsOptional, IsString, IsDate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for the Order History Report.
 * Used to validate and document the input for generating order history reports.
 */
export class OrderHistoryReportDto {
  /**
   * Optional start date for the order history report.
   * @example '2023-01-01T00:00:00.000Z'
   */
  @ApiPropertyOptional({
    description: 'The start date for the order history report',
    type: String, // The date is represented as a string in the API documentation
    format: 'date-time', // Specifies the format of the date string
    example: '2023-01-01T00:00:00.000Z', // Example of the date format
  })
  @IsOptional() // Indicates that this field is optional
  @IsDate() // Validates that the field, if provided, must be a valid date
  startDate?: Date; // Field to hold the start date for filtering orders

  /**
   * Optional end date for the order history report.
   * @example '2023-12-31T23:59:59.999Z'
   */
  @ApiPropertyOptional({
    description: 'The end date for the order history report',
    type: String, // The date is represented as a string in the API documentation
    format: 'date-time', // Specifies the format of the date string
    example: '2023-12-31T23:59:59.999Z', // Example of the date format
  })
  @IsOptional() // Indicates that this field is optional
  @IsDate() // Validates that the field, if provided, must be a valid date
  endDate?: Date; // Field to hold the end date for filtering orders

  /**
   * Optional name of the customer to filter the order history report.
   * @example 'John Doe'
   */
  @ApiPropertyOptional({
    description: 'The name of the customer to filter the order history report',
    type: String, // The customer name is represented as a string in the API documentation
    example: 'John Doe', // Example of a customer name
  })
  @IsOptional() // Indicates that this field is optional
  @IsString() // Validates that the field, if provided, must be a valid string
  customerName?: string; // Field to hold the customer name for filtering orders
}
