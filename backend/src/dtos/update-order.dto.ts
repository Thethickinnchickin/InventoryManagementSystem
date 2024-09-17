import { IsNotEmpty, IsString, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItem } from '../entities/order-item.entity';

/**
 * Data Transfer Object (DTO) for updating an existing order.
 * Used to validate and document the input for modifying order details.
 */
export class UpdateOrderDto {
  /**
   * The name of the customer who placed the order.
   * This field is required and must be a non-empty string.
   * @example 'John Doe'
   */
  @ApiProperty({
    description: 'The name of the customer who placed the order',
    type: String, // The customer name is represented as a string in the API documentation
    example: 'John Doe', // Example of a customer name
  })
  @IsNotEmpty() // Ensures that the field is not empty
  @IsString() // Validates that the field must be a string
  customerName: string; // Field to hold the updated customer name

  /**
   * The shipping address for the order.
   * This field is required and must be a non-empty string.
   * @example '123 Elm Street, Springfield'
   */
  @ApiProperty({
    description: 'The shipping address for the order',
    type: String, // The shipping address is represented as a string in the API documentation
    example: '123 Elm Street, Springfield', // Example of a shipping address
  })
  @IsNotEmpty() // Ensures that the field is not empty
  @IsString() // Validates that the field must be a string
  shippingAddress: string; // Field to hold the updated shipping address

  /**
   * The total amount for the order.
   * This field is required and must be a valid number with up to 2 decimal places.
   * @example 199.99
   */
  @ApiProperty({
    description: 'The total amount for the order',
    type: Number, // The total amount is represented as a number in the API documentation
    example: 199.99, // Example of a total amount
  })
  @IsNotEmpty() // Ensures that the field is not empty
  @IsNumber({}, { message: 'totalAmount must be a valid number with up to 2 decimal places' }) // Validates that the field must be a number
  totalAmount: number; // Field to hold the updated total amount for the order

  /**
   * The list of order items included in the order.
   * This field is required and must be an array of order items.
   * @example [
   *   {
   *     orderId: 123,
   *     productId: 456,
   *     quantity: 2,
   *     price: 49.99,
   *   },
   * ]
   */
  @ApiProperty({
    description: 'The list of order items included in the order',
    type: [OrderItem], // The items are represented as an array of OrderItem entities in the API documentation
    example: [
      {
        orderId: 123,
        productId: 456,
        quantity: 2,
        price: 49.99,
      },
    ], // Example of an array of order items
  })
  @IsArray() // Ensures that the field is an array
  items: OrderItem[]; // Field to hold the list of updated order items
}
