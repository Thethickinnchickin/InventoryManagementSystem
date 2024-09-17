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

@ApiTags('orders')  // Groups the API endpoints related to orders under the 'orders' section in Swagger UI
@ApiBearerAuth()    // Indicates that Bearer JWT authentication is required for all routes in this controller
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard) // Ensures that routes are protected by JWT authentication and role-based guards
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Roles(UserRole.ADMIN) // Restricts access to users with the Admin role
  @ApiOperation({ summary: 'Get all orders' }) // Provides a summary of the endpoint’s functionality
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', type: Number }) // Query parameter for pagination
  @ApiQuery({ name: 'limit', required: false, description: 'Number of results per page', type: Number }) // Query parameter for pagination limit
  @ApiQuery({ name: 'customerName', required: false, description: 'Filter by customer name', type: String }) // Query parameter to filter orders by customer name
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter by start date (YYYY-MM-DD)', type: String }) // Query parameter to filter by start date
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter by end date (YYYY-MM-DD)', type: String }) // Query parameter to filter by end date
  @ApiResponse({ status: 200, description: 'Successfully retrieved all orders' }) // Response for successful retrieval
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin role' }) // Response for unauthorized access
  async findAll(
    @Query('page') page: number = 1, // Default to page 1
    @Query('limit') limit: number = 10, // Default to 10 results per page
    @Query('customerName') customerName?: string, // Optional filter by customer name
    @Query('startDate') startDate?: string, // Optional filter by start date
    @Query('endDate') endDate?: string // Optional filter by end date
  ): Promise<{ orders: Order[], total: number, totalPages: number }> {
    return this.ordersService.findAll(page, limit, customerName, startDate, endDate); // Calls service to retrieve orders
  }

  @Get(':id')
  @Roles(UserRole.USER, UserRole.ADMIN) // Restricts access to users with Admin or User roles
  @ApiOperation({ summary: 'Get an order by ID' }) // Provides a summary of the endpoint’s functionality
  @ApiParam({ name: 'id', description: 'Order ID' }) // Swagger documentation for the parameter
  @ApiResponse({ status: 200, description: 'Successfully retrieved the order' }) // Response for successful retrieval
  @ApiResponse({ status: 404, description: 'Order not found' }) // Response when the order is not found
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin or User role' }) // Response for unauthorized access
  findOne(@Param('id') id: number): Promise<Order> {
    return this.ordersService.findOne(id); // Calls service to retrieve a specific order by ID
  }

  @Get('/user/all')
  @Roles(UserRole.USER) // Restricts access to users with the User role
  @ApiOperation({ summary: 'Get all orders for the authenticated user' }) // Provides a summary of the endpoint’s functionality
  @ApiResponse({ status: 200, description: 'Successfully retrieved orders for the user' }) // Response for successful retrieval
  @ApiResponse({ status: 403, description: 'Forbidden. Requires User role' }) // Response for unauthorized access
  findByUser(@Req() req: AuthenticatedRequest): Promise<Order[]> {
    return this.ordersService.findOrdersByUser(req.user.id); // Calls service to retrieve orders for the authenticated user
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.USER) // Restricts access to users with Admin or User roles
  @ApiOperation({ summary: 'Create a new order' }) // Provides a summary of the endpoint’s functionality
  @ApiResponse({ status: 201, description: 'Order successfully created' }) // Response for successful creation
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin or User role' }) // Response for unauthorized access
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: AuthenticatedRequest): Promise<Order> {
    const user: User = req.user as unknown as User; // Extracts user from request
    createOrderDto.user = user; // Assigns user to the DTO
    return this.ordersService.create(createOrderDto); // Calls service to create a new order
  }

  @Put(':id')
  @Roles(UserRole.ADMIN) // Restricts access to users with the Admin role
  @ApiOperation({ summary: 'Update an existing order' }) // Provides a summary of the endpoint’s functionality
  @ApiParam({ name: 'id', description: 'Order ID' }) // Swagger documentation for the parameter
  @ApiResponse({ status: 200, description: 'Order successfully updated' }) // Response for successful update
  @ApiResponse({ status: 404, description: 'Order not found' }) // Response when the order is not found
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin role' }) // Response for unauthorized access
  update(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
    return this.ordersService.update(id, updateOrderDto); // Calls service to update an existing order by ID
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN) // Restricts access to users with the Admin role
  @ApiOperation({ summary: 'Delete an order' }) // Provides a summary of the endpoint’s functionality
  @ApiParam({ name: 'id', description: 'Order ID' }) // Swagger documentation for the parameter
  @ApiResponse({ status: 200, description: 'Order successfully deleted' }) // Response for successful deletion
  @ApiResponse({ status: 404, description: 'Order not found' }) // Response when the order is not found
  @ApiResponse({ status: 403, description: 'Forbidden. Requires Admin role' }) // Response for unauthorized access
  remove(@Param('id') id: number): Promise<void> {
    return this.ordersService.remove(id); // Calls service to delete an order by ID
  }
}
