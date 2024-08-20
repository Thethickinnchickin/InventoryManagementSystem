import { IsNotEmpty, IsString, IsDecimal, IsArray } from 'class-validator';
import { OrderItem } from '../entities/order-item.entity';

export class UpdateOrderDto {
  @IsNotEmpty()
  @IsString()
  customerName: string;

  @IsNotEmpty()
  @IsString()
  shippingAddress: string;

  @IsNotEmpty()
  @IsDecimal()
  totalAmount: number;

  @IsArray()
  items: OrderItem[];
}
