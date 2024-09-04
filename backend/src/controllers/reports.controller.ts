import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import { Product } from '../entities/product.entity';
import { OrderHistoryFilterDto } from '../dtos/order-history-filter.dto';
import { AuditService } from '../services/audit.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../entities/user.entity';



@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService, private readonly auditService: AuditService) {}

  // Endpoint for getting stock levels
  @Get('stock-levels')
  @Roles(UserRole.ADMIN)
  async getStockLevels(): Promise<Product[]> {
    return this.reportsService.getStockLevels();
  }

  @Get('order-history')
  @Roles(UserRole.ADMIN)
  getOrderHistory(@Query() filterDto: OrderHistoryFilterDto) {
    return this.reportsService.getOrderHistory(filterDto);
  }

  @Get('order-history/report')
  @Roles(UserRole.ADMIN)
  async getOrderHistoryReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getOrderHistoryReport(startDate, endDate);
  }

  @Get('audit-log')
  @Roles(UserRole.ADMIN)
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
