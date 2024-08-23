import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import { Product } from '../entities/product.entity';
import { OrderHistoryFilterDto } from 'src/dtos/order-history-filter.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

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
}
