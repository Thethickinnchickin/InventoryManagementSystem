import { IsNotEmpty, IsInt, IsDecimal, IsNumber } from 'class-validator';


export class UpdateOrderItemDto {
  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  orderId: number;

  @IsNotEmpty()
  productId: number;
}
