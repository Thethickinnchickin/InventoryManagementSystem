import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested, MaxLength, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateOrderItemDto } from './create-order-item.dto';
import { User } from '../entities/user.entity';

/**
 * Data Transfer Object (DTO) for creating a new order.
 * Used to validate and document the input for placing a new order.
 */
export class CreateOrderDto {
  /**
   * The name of the customer placing the order.
   * This field is required and must be a non-empty string with a maximum length of 255 characters.
   * @example 'John Doe'
   */
  @ApiProperty({
    description: 'The name of the customer placing the order',
    type: String, // The customer name is represented as a string in the API documentation
    maxLength: 255, // Specifies the maximum length of the customer name
    example: 'John Doe', // Example of a customer name
  })
  @IsNotEmpty() // Ensures that this field is not empty
  @IsString() // Validates that the field must be a string
  @MaxLength(255) // Restricts the maximum length of the string to 255 characters
  customerName: string; // Field to hold the name of the customer placing the order

  /**
   * The shipping address for the order.
   * This field is required and must be a non-empty string.
   * @example '123 Main St, Anytown, USA'
   */
  @ApiProperty({
    description: 'The shipping address for the order',
    type: String, // The shipping address is represented as a string in the API documentation
    example: '123 Main St, Anytown, USA', // Example of a shipping address
  })
  @IsNotEmpty() // Ensures that this field is not empty
  @IsString() // Validates that the field must be a string
  shippingAddress: string; // Field to hold the shipping address for the order

  /**
   * The total amount for the order.
   * This field is required and must be a valid number with up to 2 decimal places.
   * @example 99.99
   */
  @ApiProperty({
    description: 'The total amount for the order, must be a valid number with up to 2 decimal places',
    type: Number, // The total amount is represented as a number in the API documentation
    example: 99.99, // Example of a total amount
  })
  @IsNotEmpty() // Ensures that this field is not empty
  @IsNumber({}, { message: 'totalAmount must be a valid number with up to 2 decimal places' }) // Validates that the total amount must be a number
  totalAmount: number; // Field to hold the total amount for the order

  /**
   * List of items included in the order.
   * This field is required and must be an array of `CreateOrderItemDto` objects.
   */
  @ApiProperty({
    description: 'List of items included in the order',
    type: [CreateOrderItemDto], // The items are represented as an array of `CreateOrderItemDto` in the API documentation
  })
  @IsArray() // Validates that the field must be an array
  @ValidateNested({ each: true }) // Validates that each item in the array must be an instance of `CreateOrderItemDto`
  @Type(() => CreateOrderItemDto) // Transforms plain objects to instances of `CreateOrderItemDto`
  items: CreateOrderItemDto[]; // Field to hold the list of items in the order

  /**
   * Optional user associated with the order.
   * This field is optional and, if provided, must be an instance of the `User` entity.
   */
  @ApiProperty({
    description: 'Optional user associated with the order',
    type: User, // The user is represented as an instance of the `User` entity in the API documentation
    required: false, // This field is not required
  })
  @IsOptional() // Indicates that this field is optional
  user?: User; // Field to hold the optional user associated with the order
}
