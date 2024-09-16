import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { OrderItemsService } from '../services/order-items.service';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderItemDto } from '../dtos/create-order-item.dto';
import { UpdateOrderItemDto } from '../dtos/update-order-item.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../entities/user.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('order-items')  // Group this controller under the 'order-items' section in Swagger
@ApiBearerAuth()         // JWT authentication required for all endpoints
@Controller('order-items')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Retrieve all order items' })
  @ApiResponse({ status: 200, description: 'Returns an array of all order items' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin or User role' })
  findAll(): Promise<OrderItem[]> {
    return this.orderItemsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Retrieve a specific order item by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the order item to retrieve' })
  @ApiResponse({ status: 200, description: 'Returns the order item with the given ID' })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin or User role' })
  findOne(@Param('id') id: number): Promise<OrderItem> {
    return this.orderItemsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new order item' })
  @ApiResponse({ status: 201, description: 'The order item has been successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin role' })
  create(@Body() createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    return this.orderItemsService.create(createOrderItemDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update an existing order item' })
  @ApiParam({ name: 'id', description: 'The ID of the order item to update' })
  @ApiResponse({ status: 200, description: 'The order item has been successfully updated' })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin role' })
  update(@Param('id') id: number, @Body() updateOrderItemDto: UpdateOrderItemDto): Promise<OrderItem> {
    return this.orderItemsService.update(id, updateOrderItemDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete an order item' })
  @ApiParam({ name: 'id', description: 'The ID of the order item to delete' })
  @ApiResponse({ status: 200, description: 'The order item has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin role' })
  remove(@Param('id') id: number): Promise<void> {
    return this.orderItemsService.remove(id);
  }
}
