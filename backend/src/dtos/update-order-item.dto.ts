import { IsNotEmpty, IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for updating an order item.
 * Used to validate and document the input for modifying details of an existing order item.
 */
export class UpdateOrderItemDto {
  /**
   * The quantity of the order item to be updated.
   * This field is required and must be an integer.
   * @example 5
   */
  @ApiProperty({
    description: 'The quantity of the order item',
    type: Number, // The quantity is represented as a number in the API documentation
    example: 5, // Example of a quantity value
  })
  @IsNotEmpty() // Ensures that the field is not empty
  @IsInt() // Validates that the field must be an integer
  quantity: number; // Field to hold the updated quantity of the order item

  /**
   * The price of the order item to be updated.
   * This field is required and must be a valid number.
   * @example 99.99
   */
  @ApiProperty({
    description: 'The price of the order item',
    type: Number, // The price is represented as a number in the API documentation
    example: 99.99, // Example of a price value
  })
  @IsNotEmpty() // Ensures that the field is not empty
  @IsNumber({}, { message: 'price must be a valid number' }) // Validates that the field must be a number
  price: number; // Field to hold the updated price of the order item

  /**
   * The ID of the associated order to which this item belongs.
   * This field is required and must be an integer.
   * @example 123
   */
  @ApiProperty({
    description: 'The ID of the associated order',
    type: Number, // The order ID is represented as a number in the API documentation
    example: 123, // Example of an order ID
  })
  @IsNotEmpty() // Ensures that the field is not empty
  @IsInt() // Validates that the field must be an integer
  orderId: number; // Field to hold the ID of the associated order

  /**
   * The ID of the associated product being ordered.
   * This field is required and must be an integer.
   * @example 456
   */
  @ApiProperty({
    description: 'The ID of the associated product',
    type: Number, // The product ID is represented as a number in the API documentation
    example: 456, // Example of a product ID
  })
  @IsNotEmpty() // Ensures that the field is not empty
  @IsInt() // Validates that the field must be an integer
  productId: number; // Field to hold the ID of the associated product
}
