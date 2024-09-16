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

@ApiTags('reports') // Group reports-related endpoints in Swagger
@ApiBearerAuth() // Require JWT authentication for all routes in this controller
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService, private readonly auditService: AuditService) {}

  @Get('stock-levels')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get stock levels of all products' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved stock levels' })
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' })
  async getStockLevels(): Promise<Product[]> {
    return this.reportsService.getStockLevels();
  }

  @Get('order-history')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get order history with optional filtering' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved order history' })
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' })
  getOrderHistory(@Query() filterDto: OrderHistoryFilterDto) {
    return this.reportsService.getOrderHistory(filterDto);
  }

  @Get('order-history/report')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get order history report for a specific date range' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date for the report (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date for the report (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Successfully generated order history report' })
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' })
  async getOrderHistoryReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getOrderHistoryReport(startDate, endDate);
  }

  @Get('audit-log')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get audit logs with optional filters' })
  @ApiQuery({ name: 'page', required: true, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: true, description: 'Number of records per page' })
  @ApiQuery({ name: 'entityName', required: false, description: 'Filter by entity name' })
  @ApiQuery({ name: 'action', required: false, description: 'Filter by action performed' })
  @ApiQuery({ name: 'performedBy', required: false, description: 'Filter by user who performed the action' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved audit logs' })
  @ApiResponse({ status: 403, description: 'Forbidden. Authorization required' })
  async getAuditLogs(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('entityName') entityName?: string,
    @Query('action') action?: string,
    @Query('performedBy') performedBy?: string,
  ) {
    return await this.auditService.getAuditLogs(page, limit, { entityName, action, performedBy });
  }
}
