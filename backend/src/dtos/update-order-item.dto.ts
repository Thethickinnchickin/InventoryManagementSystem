import { IsNotEmpty, IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderItemDto {
  @ApiProperty({
    description: 'The quantity of the order item',
    type: Number,
    example: 5,
  })
  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @ApiProperty({
    description: 'The price of the order item',
    type: Number,
    example: 99.99,
  })
  @IsNotEmpty()
  @IsNumber({}, { message: 'price must be a valid number' })
  price: number;

  @ApiProperty({
    description: 'The ID of the associated order',
    type: Number,
    example: 123,
  })
  @IsNotEmpty()
  @IsInt()
  orderId: number;

  @ApiProperty({
    description: 'The ID of the associated product',
    type: Number,
    example: 456,
  })
  @IsNotEmpty()
  @IsInt()
  productId: number;
}
