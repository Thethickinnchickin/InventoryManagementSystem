import { IsNotEmpty, IsInt, IsDecimal } from 'class-validator';


export class UpdateOrderItemDto {
  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @IsNotEmpty()
  @IsDecimal()
  price: number;

  @IsNotEmpty()
  orderId: number;

  @IsNotEmpty()
  productId: number;
}
