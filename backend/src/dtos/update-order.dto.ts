import { IsNotEmpty, IsString, IsDecimal, IsArray, IsNumber } from 'class-validator';
import { OrderItem } from '../entities/order-item.entity';

export class UpdateOrderDto {
  @IsNotEmpty()
  @IsString()
  customerName: string;

  @IsNotEmpty()
  @IsString()
  shippingAddress: string;

  @IsNotEmpty()
  @IsNumber({maxDecimalPlaces: 2})
  totalAmount: number;

  @IsArray()
  items: OrderItem[];
}
