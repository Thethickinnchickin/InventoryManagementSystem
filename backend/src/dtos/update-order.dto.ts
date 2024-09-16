import { IsNotEmpty, IsString, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItem } from '../entities/order-item.entity';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'The name of the customer who placed the order',
    type: String,
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  customerName: string;

  @ApiProperty({
    description: 'The shipping address for the order',
    type: String,
    example: '123 Elm Street, Springfield',
  })
  @IsNotEmpty()
  @IsString()
  shippingAddress: string;

  @ApiProperty({
    description: 'The total amount for the order',
    type: Number,
    example: 199.99,
  })
  @IsNotEmpty()
  @IsNumber({}, { message: 'totalAmount must be a valid number with up to 2 decimal places' })
  totalAmount: number;

  @ApiProperty({
    description: 'The list of order items included in the order',
    type: [OrderItem],
    example: [
      {
        orderId: 123,
        productId: 456,
        quantity: 2,
        price: 49.99,
      },
    ],
  })
  @IsArray()
  items: OrderItem[];
}
