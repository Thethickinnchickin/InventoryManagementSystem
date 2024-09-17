import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import { Product } from '../entities/product.entity';
import { OrderHistoryFilterDto } from '../dtos/order-history-filter.dto';
import { AuditService } from '../services/audit.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../entities/user.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('reports') // Groups the reports-related API endpoints under the 'reports' section in Swagger UI
@ApiBearerAuth() // Requires JWT authentication for all routes in this controller
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard) // Protects all routes in this controller with JWT authentication and role-based authorization
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly auditService: AuditService
  ) {}

  @Get('stock-levels')
  @Roles(UserRole.ADMIN) // Restricts access to this route to users with the ADMIN role
  @ApiOperation({ summary: 'Get stock levels of all products' }) // Provides a summary of what this endpoint does
  @ApiResponse({ status: 200, description: 'Successfully retrieved stock levels' }) // Response for successful retrieval of stock levels
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' }) // Response for unauthorized access
  async getStockLevels(): Promise<Product[]> {
    return this.reportsService.getStockLevels(); // Calls service to get stock levels of all products
  }

  @Get('order-history')
  @Roles(UserRole.ADMIN) // Restricts access to this route to users with the ADMIN role
  @ApiOperation({ summary: 'Get order history with optional filtering' }) // Provides a summary of what this endpoint does
  @ApiResponse({ status: 200, description: 'Successfully retrieved order history' }) // Response for successful retrieval of order history
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' }) // Response for unauthorized access
  getOrderHistory(@Query() filterDto: OrderHistoryFilterDto) {
    return this.reportsService.getOrderHistory(filterDto); // Calls service to get order history with optional filters
  }

  @Get('order-history/report')
  @Roles(UserRole.ADMIN) // Restricts access to this route to users with the ADMIN role
  @ApiOperation({ summary: 'Get order history report for a specific date range' }) // Provides a summary of what this endpoint does
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date for the report (YYYY-MM-DD)' }) // Query parameter for start date
  @ApiQuery({ name: 'endDate', required: true, description: 'End date for the report (YYYY-MM-DD)' }) // Query parameter for end date
  @ApiResponse({ status: 200, description: 'Successfully generated order history report' }) // Response for successful report generation
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' }) // Response for unauthorized access
  async getOrderHistoryReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.reportsService.getOrderHistoryReport(startDate, endDate); // Calls service to get order history report for a specified date range
  }

  @Get('audit-log')
  @Roles(UserRole.ADMIN) // Restricts access to this route to users with the ADMIN role
  @ApiOperation({ summary: 'Get audit logs with optional filters' }) // Provides a summary of what this endpoint does
  @ApiQuery({ name: 'page', required: true, description: 'Page number for pagination' }) // Query parameter for pagination
  @ApiQuery({ name: 'limit', required: true, description: 'Number of records per page' }) // Query parameter for pagination
  @ApiQuery({ name: 'entityName', required: false, description: 'Filter by entity name' }) // Optional query parameter to filter by entity name
  @ApiQuery({ name: 'action', required: false, description: 'Filter by action performed' }) // Optional query parameter to filter by action
  @ApiQuery({ name: 'performedBy', required: false, description: 'Filter by user who performed the action' }) // Optional query parameter to filter by user
  @ApiResponse({ status: 200, description: 'Successfully retrieved audit logs' }) // Response for successful retrieval of audit logs
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' }) // Response for unauthorized access
  async getAuditLogs(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('entityName') entityName?: string,
    @Query('action') action?: string,
    @Query('performedBy') performedBy?: string
  ) {
    return await this.auditService.getAuditLogs(page, limit, { entityName, action, performedBy }); // Calls service to get audit logs with optional filters
  }
}
