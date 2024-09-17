import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for creating a new category.
 * Used to validate and document the input for adding a new category.
 */
export class CreateCategoryDto {
  /**
   * The name of the category.
   * This field is required and must be a non-empty string with a maximum length of 255 characters.
   * @example 'Electronics'
   */
  @ApiProperty({
    description: 'The name of the category',
    type: String, // The category name is represented as a string in the API documentation
    maxLength: 255, // Specifies the maximum length of the category name
    example: 'Electronics', // Example of a category name
  })
  @IsNotEmpty() // Ensures that this field is not empty
  @IsString() // Validates that the field must be a string
  @MaxLength(255) // Restricts the maximum length of the string to 255 characters
  name: string; // Field to hold the name of the category
}
