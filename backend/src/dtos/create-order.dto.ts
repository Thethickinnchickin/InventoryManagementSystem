import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested, MaxLength, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateOrderItemDto } from './create-order-item.dto';
import { User } from '../entities/user.entity';

export class CreateOrderDto {
  @ApiProperty({
    description: 'The name of the customer placing the order',
    type: String,
    maxLength: 255,
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  customerName: string;

  @ApiProperty({
    description: 'The shipping address for the order',
    type: String,
    example: '123 Main St, Anytown, USA',
  })
  @IsNotEmpty()
  @IsString()
  shippingAddress: string;

  @ApiProperty({
    description: 'The total amount for the order, must be a valid number with up to 2 decimal places',
    type: Number,
    example: 99.99,
  })
  @IsNotEmpty()
  @IsNumber({}, { message: 'totalAmount must be a valid number with up to 2 decimal places' })
  totalAmount: number;

  @ApiProperty({
    description: 'List of items included in the order',
    type: [CreateOrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiProperty({
    description: 'Optional user associated with the order',
    type: User,
    required: false,
  })
  @IsOptional()
  user?: User;
}

