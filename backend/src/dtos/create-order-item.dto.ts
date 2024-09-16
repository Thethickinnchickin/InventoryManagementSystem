import { IsNotEmpty, IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'The ID of the order to which this item belongs',
    type: Number,
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  orderId: number;

  @ApiProperty({
    description: 'The ID of the product being ordered',
    type: Number,
    example: 101,
  })
  @IsNotEmpty()
  @IsInt()
  productId: number;

  @ApiProperty({
    description: 'The quantity of the product being ordered',
    type: Number,
    example: 2,
  })
  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @ApiProperty({
    description: 'The price of the product, must be a valid number with up to 2 decimal places',
    type: Number,
    example: 19.99,
  })
  @IsNotEmpty()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 2 }, { message: 'price must be a valid number with up to 2 decimal places' })
  price: number;
}
