import { IsString, IsOptional, IsInt, MinLength, Min, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for updating product details.
 * Used to validate and document the input for modifying an existing product.
 */
export class UpdateProductDto {
  /**
   * The name of the product.
   * This field is optional and must be a string with a minimum length of 1 character if provided.
   * @example 'Smartphone'
   */
  @ApiProperty({
    description: 'The name of the product',
    type: String, // The name is represented as a string in the API documentation
    minLength: 1, // Minimum length of 1 character
    example: 'Smartphone', // Example of a product name
    required: false, // This field is optional
  })
  @IsOptional() // Makes this field optional
  @IsString() // Validates that the field must be a string
  @MinLength(1) // Ensures that the string has a minimum length of 1 character
  name?: string; // Field to hold the updated name of the product

  /**
   * The description of the product.
   * This field is optional and must be a string if provided.
   * @example 'Latest model with advanced features'
   */
  @ApiProperty({
    description: 'The description of the product',
    type: String, // The description is represented as a string in the API documentation
    example: 'Latest model with advanced features', // Example of a product description
    required: false, // This field is optional
  })
  @IsOptional() // Makes this field optional
  @IsString() // Validates that the field must be a string
  description?: string; // Field to hold the updated description of the product

  /**
   * The price of the product.
   * This field is optional and must be a valid number with up to 2 decimal places if provided.
   * @example 499.99
   */
  @ApiProperty({
    description: 'The price of the product',
    type: Number, // The price is represented as a number in the API documentation
    example: 499.99, // Example of a product price
    required: false, // This field is optional
  })
  @IsOptional() // Makes this field optional
  @IsNumber({}, { message: 'price must be a valid number with up to 2 decimal places' }) // Validates that the field must be a number
  price?: number; // Field to hold the updated price of the product

  /**
   * The stock quantity of the product.
   * This field is optional and must be an integer greater than or equal to 0 if provided.
   * @example 100
   */
  @ApiProperty({
    description: 'The stock quantity of the product',
    type: Number, // The stock quantity is represented as a number in the API documentation
    example: 100, // Example of a stock quantity
    required: false, // This field is optional
  })
  @IsOptional() // Makes this field optional
  @IsInt() // Validates that the field must be an integer
  @Min(0) // Ensures that the integer is greater than or equal to 0
  stock?: number; // Field to hold the updated stock quantity of the product

  /**
   * List of category IDs associated with the product.
   * This field is optional and must be an array of numbers if provided.
   * @example [1, 2]
   */
  @ApiProperty({
    description: 'List of category IDs associated with the product',
    type: [Number], // The category IDs are represented as an array of numbers in the API documentation
    example: [1, 2], // Example of a list of category IDs
    required: false, // This field is optional
  })
  @IsOptional() // Makes this field optional
  @IsNumber({}, { each: true }) // Validates that each element in the array must be a number
  categoryIds?: number[]; // Field to hold the list of updated category IDs associated with the product
}
