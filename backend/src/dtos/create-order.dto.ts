// src/orders/dto/create-order.dto.ts
import { IsNotEmpty, IsString, IsDecimal, IsArray, ValidateNested, MaxLength, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';
import { User } from 'src/entities/user.entity';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  customerName: string;

  @IsNotEmpty()
  @IsString()
  shippingAddress: string;

  @IsNotEmpty()
  @IsDecimal()
  totalAmount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @IsOptional()
  user: User;
}
