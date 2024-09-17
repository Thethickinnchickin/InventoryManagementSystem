import { IsNotEmpty, IsString, IsInt, Min, MaxLength, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for creating a new product.
 * Used to validate and document the input for adding a new product.
 */
export class CreateProductDto {
  /**
   * The name of the product.
   * This field is required and must be a non-empty string with a maximum length of 255 characters.
   * @example 'Sample Product'
   */
  @ApiProperty({
    description: 'The name of the product',
    type: String, // The product name is represented as a string in the API documentation
    maxLength: 255, // Specifies the maximum length of the product name
    example: 'Sample Product', // Example of a product name
  })
  @IsNotEmpty() // Ensures that this field is not empty
  @IsString() // Validates that the field must be a string
  @MaxLength(255) // Restricts the maximum length of the string to 255 characters
  name: string; // Field to hold the name of the product

  /**
   * A brief description of the product.
   * This field is required and must be a non-empty string.
   * @example 'This is a sample product description.'
   */
  @ApiProperty({
    description: 'A brief description of the product',
    type: String, // The description is represented as a string in the API documentation
    example: 'This is a sample product description.', // Example of a product description
  })
  @IsNotEmpty() // Ensures that this field is not empty
  @IsString() // Validates that the field must be a string
  description: string; // Field to hold the description of the product

  /**
   * The price of the product.
   * This field is required and must be a valid number with up to 2 decimal places.
   * @example 19.99
   */
  @ApiProperty({
    description: 'The price of the product, must be a valid number with up to 2 decimal places',
    type: Number, // The price is represented as a number in the API documentation
    example: 19.99, // Example of a product price
  })
  @IsNotEmpty() // Ensures that this field is not empty
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'price must be a number with up to 2 decimal places' }) // Validates that the price must be a number with up to 2 decimal places
  price: number; // Field to hold the price of the product

  /**
   * The stock quantity of the product.
   * This field is required and must be an integer greater than or equal to 0.
   * @example 100
   */
  @ApiProperty({
    description: 'The stock quantity of the product',
    type: Number, // The stock quantity is represented as a number in the API documentation
    example: 100, // Example of a stock quantity
  })
  @IsInt() // Validates that the field must be an integer
  @Min(0) // Ensures that the stock quantity is not less than 0
  stock: number; // Field to hold the stock quantity of the product

  /**
   * Optional list of category IDs associated with the product.
   * If provided, this field must be an array of numbers.
   * @example [1, 2, 3]
   */
  @ApiProperty({
    description: 'Optional list of category IDs associated with the product',
    type: [Number], // The category IDs are represented as an array of numbers in the API documentation
    required: false, // This field is not required
    example: [1, 2, 3], // Example of category IDs
  })
  @IsNumber({}, { each: true }) // Validates that each item in the array must be a number
  @IsOptional() // Indicates that this field is optional
  categoryIds?: number[]; // Field to hold an optional list of category IDs
}
