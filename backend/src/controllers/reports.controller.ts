import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import { Product } from '../entities/product.entity';
import { OrderHistoryFilterDto } from 'src/dtos/order-history-filter.dto';
import { AuditService } from '../services/audit.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService, private readonly auditService: AuditService) {}

  // Endpoint for getting stock levels
  @Get('stock-levels')
  async getStockLevels(): Promise<Product[]> {
    return this.reportsService.getStockLevels();
  }

  @Get('order-history')
  getOrderHistory(@Query() filterDto: OrderHistoryFilterDto) {
    return this.reportsService.getOrderHistory(filterDto);
  }

  @Get('order-history/report')
  async getOrderHistoryReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getOrderHistoryReport(startDate, endDate);
  }

  @Get('audit-log')
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
