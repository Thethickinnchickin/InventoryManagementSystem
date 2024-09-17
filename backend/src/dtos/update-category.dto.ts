import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for updating an existing category.
 * Used to validate and document the input for updating category details.
 */
export class UpdateCategoryDto {
  /**
   * The name of the category to be updated.
   * This field is required and must be a non-empty string.
   * @example 'Electronics'
   */
  @ApiProperty({
    description: 'The name of the category to be updated',
    type: String, // The category name is represented as a string in the API documentation
    example: 'Electronics', // Example of a category name
  })
  @IsNotEmpty() // Ensures that the field is not empty
  @IsString() // Validates that the field must be a string
  name: string; // Field to hold the updated name of the category
}
