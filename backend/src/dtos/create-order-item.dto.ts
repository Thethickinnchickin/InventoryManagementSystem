// src/orders/dto/create-order-item.dto.ts
import { IsNotEmpty, IsInt, IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsInt()
  orderId: number;

  @IsNotEmpty()
  @IsInt()
  productId: number;

  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @IsNotEmpty()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 2 }, { message: 'price must be a valid number with up to 2 decimal places' })
  price: number;
}
