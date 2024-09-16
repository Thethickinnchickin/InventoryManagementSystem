import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User, UserRole } from '../entities/user.entity';
import { AuthenticatedRequest } from 'src/types/express-request.interface';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('orders')  // Group the orders-related API endpoints in the Swagger UI
@ApiBearerAuth()    // JWT authentication required for all routes
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all orders' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of results per page', type: Number })
  @ApiQuery({ name: 'customerName', required: false, description: 'Filter by customer name', type: String })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter by start date (YYYY-MM-DD)', type: String })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter by end date (YYYY-MM-DD)', type: String })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all orders' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin role' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('customerName') customerName?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ): Promise<{ orders: Order[], total: number, totalPages: number }> {
    return this.ordersService.findAll(page, limit, customerName, startDate, endDate);
  }

  @Get(':id')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the order' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin or User role' })
  findOne(@Param('id') id: number): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Get('/user/all')
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Get all orders for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved orders for the user' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires User role' })
  findByUser(@Req() req: AuthenticatedRequest): Promise<Order[]> {
    return this.ordersService.findOrdersByUser(req.user.id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin or User role' })
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: AuthenticatedRequest): Promise<Order> {
    const user: User = req.user as unknown as User; 
    createOrderDto.user = user;
    return this.ordersService.create(createOrderDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update an existing order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order successfully updated' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin role' })
  update(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete an order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order successfully deleted' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin role' })
  remove(@Param('id') id: number): Promise<void> {
    return this.ordersService.remove(id);
  }
}
