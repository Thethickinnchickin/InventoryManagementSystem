import { IsNotEmpty, IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for creating an order item.
 * Used to validate and document the input for adding items to an order.
 */
export class CreateOrderItemDto {
  /**
   * The ID of the order to which this item belongs.
   * This field is required and must be an integer.
   * @example 1
   */
  @ApiProperty({
    description: 'The ID of the order to which this item belongs',
    type: Number, // The order ID is represented as a number in the API documentation
    example: 1, // Example of an order ID
  })
  @IsNotEmpty() // Ensures that this field is not empty
  @IsInt() // Validates that the field must be an integer
  orderId: number; // Field to hold the ID of the order

  /**
   * The ID of the product being ordered.
   * This field is required and must be an integer.
   * @example 101
   */
  @ApiProperty({
    description: 'The ID of the product being ordered',
    type: Number, // The product ID is represented as a number in the API documentation
    example: 101, // Example of a product ID
  })
  @IsNotEmpty() // Ensures that this field is not empty
  @IsInt() // Validates that the field must be an integer
  productId: number; // Field to hold the ID of the product

  /**
   * The quantity of the product being ordered.
   * This field is required and must be an integer.
   * @example 2
   */
  @ApiProperty({
    description: 'The quantity of the product being ordered',
    type: Number, // The quantity is represented as a number in the API documentation
    example: 2, // Example of a quantity
  })
  @IsNotEmpty() // Ensures that this field is not empty
  @IsInt() // Validates that the field must be an integer
  quantity: number; // Field to hold the quantity of the product

  /**
   * The price of the product, must be a valid number with up to 2 decimal places.
   * This field is required and must be a number.
   * @example 19.99
   */
  @ApiProperty({
    description: 'The price of the product, must be a valid number with up to 2 decimal places',
    type: Number, // The price is represented as a number in the API documentation
    example: 19.99, // Example of a product price
  })
  @IsNotEmpty() // Ensures that this field is not empty
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 2 }, { message: 'price must be a valid number with up to 2 decimal places' }) // Validates that the price must be a number with up to 2 decimal places
  price: number; // Field to hold the price of the product
}
