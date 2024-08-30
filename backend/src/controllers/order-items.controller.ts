import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { OrderItemsService } from '../services/order-items.service';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderItemDto } from '../dtos/create-order-item.dto';
import { UpdateOrderItemDto } from '../dtos/update-order-item.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/entities/user.entity';

@Controller('order-items')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  findAll(): Promise<OrderItem[]> {
    return this.orderItemsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  findOne(@Param('id') id: number): Promise<OrderItem> {
    return this.orderItemsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    return this.orderItemsService.create(createOrderItemDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: number, @Body() updateOrderItemDto: UpdateOrderItemDto): Promise<OrderItem> {
    return this.orderItemsService.update(id, updateOrderItemDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: number): Promise<void> {
    return this.orderItemsService.remove(id);
  }
}
