import { IsString, IsOptional, IsInt, MinLength, Min, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for updating a product category.
 * Used to validate and document the input for modifying details of an existing product category.
 */
export class UpdateProductCategoryDto {
  /**
   * The name of the product category.
   * This field is optional and must be a string with a minimum length of 1 character if provided.
   * @example 'Electronics'
   */
  @ApiProperty({
    description: 'The name of the product category',
    type: String, // The name is represented as a string in the API documentation
    minLength: 1, // Minimum length of 1 character
    example: 'Electronics', // Example of a category name
    required: false, // This field is optional
  })
  @IsOptional() // Makes this field optional
  @IsString() // Validates that the field must be a string
  @MinLength(1) // Ensures that the string has a minimum length of 1 character
  name?: string; // Field to hold the updated name of the category

  /**
   * The description of the product category.
   * This field is optional and must be a string if provided.
   * @example 'Devices and gadgets related to electronics'
   */
  @ApiProperty({
    description: 'The description of the product category',
    type: String, // The description is represented as a string in the API documentation
    example: 'Devices and gadgets related to electronics', // Example of a category description
    required: false, // This field is optional
  })
  @IsOptional() // Makes this field optional
  @IsString() // Validates that the field must be a string
  description?: string; // Field to hold the updated description of the category

  /**
   * The price of the product.
   * This field is optional and must be a valid number with up to 2 decimal places if provided.
   * @example 299.99
   */
  @ApiProperty({
    description: 'The price of the product',
    type: Number, // The price is represented as a number in the API documentation
    example: 299.99, // Example of a price value
    required: false, // This field is optional
  })
  @IsOptional() // Makes this field optional
  @IsNumber({}, { message: 'price must be a valid number with up to 2 decimal places' }) // Validates that the field must be a number
  price?: number; // Field to hold the updated price of the product

  /**
   * The stock quantity of the product.
   * This field is optional and must be an integer greater than or equal to 0 if provided.
   * @example 50
   */
  @ApiProperty({
    description: 'The stock quantity of the product',
    type: Number, // The stock quantity is represented as a number in the API documentation
    example: 50, // Example of a stock quantity
    required: false, // This field is optional
  })
  @IsOptional() // Makes this field optional
  @IsInt() // Validates that the field must be an integer
  @Min(0) // Ensures that the integer is greater than or equal to 0
  stock?: number; // Field to hold the updated stock quantity of the product

  /**
   * List of category IDs associated with the product.
   * This field is optional and must be an array of numbers if provided.
   * @example [1, 2, 3]
   */
  @ApiProperty({
    description: 'List of category IDs associated with the product',
    type: [Number], // The category IDs are represented as an array of numbers in the API documentation
    example: [1, 2, 3], // Example of a list of category IDs
    required: false, // This field is optional
  })
  @IsOptional() // Makes this field optional
  @IsNumber({}, { each: true }) // Validates that each element in the array must be a number
  categoryIds?: number[]; // Field to hold the list of updated category IDs associated with the product
}
