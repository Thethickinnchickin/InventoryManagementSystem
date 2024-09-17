import { IsOptional, IsString, IsDateString, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for filtering order history reports.
 * Used to validate and document the input for querying order history with various filters.
 */
export class OrderHistoryFilterDto {
  /**
   * The start date for filtering orders.
   * This field is optional and must be a valid ISO 8601 date-time string if provided.
   * @example '2024-01-01T00:00:00Z'
   */
  @ApiProperty({
    description: 'The start date for filtering orders',
    type: String, // The start date is represented as a string in the API documentation
    format: 'date-time', // Specifies that the format is a date-time string
    required: false, // This field is optional
    example: '2024-01-01T00:00:00Z', // Example of a start date
  })
  @IsOptional() // Indicates that this field is optional
  @IsDateString() // Validates that the field must be a valid ISO 8601 date-time string
  startDate?: string; // Field to hold the start date for filtering orders

  /**
   * The end date for filtering orders.
   * This field is optional and must be a valid ISO 8601 date-time string if provided.
   * @example '2024-12-31T23:59:59Z'
   */
  @ApiProperty({
    description: 'The end date for filtering orders',
    type: String, // The end date is represented as a string in the API documentation
    format: 'date-time', // Specifies that the format is a date-time string
    required: false, // This field is optional
    example: '2024-12-31T23:59:59Z', // Example of an end date
  })
  @IsOptional() // Indicates that this field is optional
  @IsDateString() // Validates that the field must be a valid ISO 8601 date-time string
  endDate?: string; // Field to hold the end date for filtering orders

  /**
   * The name of the customer to filter orders by.
   * This field is optional and must be a string if provided.
   * @example 'John Doe'
   */
  @ApiProperty({
    description: 'The name of the customer to filter orders by',
    type: String, // The customer name is represented as a string in the API documentation
    required: false, // This field is optional
    example: 'John Doe', // Example of a customer name
  })
  @IsOptional() // Indicates that this field is optional
  @IsString() // Validates that the field must be a string
  customerName?: string; // Field to hold the name of the customer for filtering orders

  /**
   * Minimum total amount for filtering orders.
   * This field is optional and must be a string representing a number if provided.
   * @example '100'
   */
  @ApiProperty({
    description: 'Minimum total amount for filtering orders',
    type: String, // The minimum total amount is represented as a string in the API documentation
    required: false, // This field is optional
    example: '100', // Example of a minimum total amount
  })
  @IsOptional() // Indicates that this field is optional
  @IsNumberString() // Validates that the field must be a string representing a number
  minTotalAmount?: string; // Field to hold the minimum total amount for filtering orders

  /**
   * Maximum total amount for filtering orders.
   * This field is optional and must be a string representing a number if provided.
   * @example '500'
   */
  @ApiProperty({
    description: 'Maximum total amount for filtering orders',
    type: String, // The maximum total amount is represented as a string in the API documentation
    required: false, // This field is optional
    example: '500', // Example of a maximum total amount
  })
  @IsOptional() // Indicates that this field is optional
  @IsNumberString() // Validates that the field must be a string representing a number
  maxTotalAmount?: string; // Field to hold the maximum total amount for filtering orders
}
