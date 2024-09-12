// src/orders/dto/create-order.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested, MaxLength, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';
import { User } from '../entities/user.entity';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  customerName: string;

  @IsNotEmpty()
  @IsString()
  shippingAddress: string;

  @IsNotEmpty()
  @IsNumber({}, { message: 'price must be a valid number with up to 2 decimal places' })
  totalAmount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @IsOptional()
  user?: User;
}
