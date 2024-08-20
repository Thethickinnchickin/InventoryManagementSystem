// src/orders/dto/create-order-item.dto.ts
import { IsNotEmpty, IsInt, IsDecimal } from 'class-validator';

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
  @IsDecimal()
  price: number;
}
