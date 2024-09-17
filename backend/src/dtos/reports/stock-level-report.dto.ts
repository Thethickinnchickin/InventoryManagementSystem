import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for the Stock Level Report.
 * Used to validate and document the input for generating stock level reports.
 */
export class StockLevelReportDto {
  /**
   * Optional category to filter the stock levels report.
   * @example 'Electronics'
   */
  @ApiPropertyOptional({
    description: 'The category to filter the stock levels report',
    type: String, // The category is represented as a string in the API documentation
    example: 'Electronics', // Example of a category name
  })
  @IsOptional() // Indicates that this field is optional
  @IsString() // Validates that the field, if provided, must be a valid string
  category?: string; // Field to hold the category for filtering stock levels
}
