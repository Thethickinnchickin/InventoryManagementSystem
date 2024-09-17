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

@ApiTags('order-items')  // Groups this controller under the 'order-items' section in Swagger UI
@ApiBearerAuth()         // Indicates that Bearer JWT authentication is required for all endpoints in this controller
@Controller('order-items')
@UseGuards(JwtAuthGuard, RolesGuard) // Guards to ensure JWT authentication and role-based access
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER) // Restricts access to users with Admin or User roles
  @ApiOperation({ summary: 'Retrieve all order items' }) // Describes what this endpoint does
  @ApiResponse({ status: 200, description: 'Returns an array of all order items' }) // Successful response
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin or User role' }) // Response when user does not have required role
  findAll(): Promise<OrderItem[]> {
    return this.orderItemsService.findAll(); // Calls service to retrieve all order items
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER) // Restricts access to users with Admin or User roles
  @ApiOperation({ summary: 'Retrieve a specific order item by ID' }) // Describes what this endpoint does
  @ApiParam({ name: 'id', description: 'The ID of the order item to retrieve' }) // Swagger documentation for the parameter
  @ApiResponse({ status: 200, description: 'Returns the order item with the given ID' }) // Successful response
  @ApiResponse({ status: 404, description: 'Order item not found' }) // Response when the order item is not found
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin or User role' }) // Response when user does not have required role
  findOne(@Param('id') id: number): Promise<OrderItem> {
    return this.orderItemsService.findOne(id); // Calls service to retrieve the order item by ID
  }

  @Post()
  @Roles(UserRole.ADMIN) // Restricts access to users with Admin role
  @ApiOperation({ summary: 'Create a new order item' }) // Describes what this endpoint does
  @ApiResponse({ status: 201, description: 'The order item has been successfully created' }) // Successful response
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin role' }) // Response when user does not have required role
  create(@Body() createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    return this.orderItemsService.create(createOrderItemDto); // Calls service to create a new order item
  }

  @Put(':id')
  @Roles(UserRole.ADMIN) // Restricts access to users with Admin role
  @ApiOperation({ summary: 'Update an existing order item' }) // Describes what this endpoint does
  @ApiParam({ name: 'id', description: 'The ID of the order item to update' }) // Swagger documentation for the parameter
  @ApiResponse({ status: 200, description: 'The order item has been successfully updated' }) // Successful response
  @ApiResponse({ status: 404, description: 'Order item not found' }) // Response when the order item is not found
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin role' }) // Response when user does not have required role
  update(@Param('id') id: number, @Body() updateOrderItemDto: UpdateOrderItemDto): Promise<OrderItem> {
    return this.orderItemsService.update(id, updateOrderItemDto); // Calls service to update the order item by ID
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN) // Restricts access to users with Admin role
  @ApiOperation({ summary: 'Delete an order item' }) // Describes what this endpoint does
  @ApiParam({ name: 'id', description: 'The ID of the order item to delete' }) // Swagger documentation for the parameter
  @ApiResponse({ status: 200, description: 'The order item has been successfully deleted' }) // Successful response
  @ApiResponse({ status: 404, description: 'Order item not found' }) // Response when the order item is not found
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin role' }) // Response when user does not have required role
  remove(@Param('id') id: number): Promise<void> {
    return this.orderItemsService.remove(id); // Calls service to delete the order item by ID
  }
}
