import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Order } from '../entities/order.entity';
import { OrderHistoryFilterDto } from '../dtos/order-history-filter.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>, // Repository for product entity

    @InjectRepository(Order)
    private ordersRepository: Repository<Order>, // Repository for order entity
  ) {}

  /**
   * Retrieve stock levels of all products, ordered by stock quantity in ascending order.
   * @returns A list of products with their names and stock levels.
   */
  async getStockLevels(): Promise<Product[]> {  
    const stockLevels = await this.productsRepository.find({
      select: ['name', 'stock'], // Only select name and stock fields
      order: { stock: 'ASC' }, // Order by stock in ascending order
    });

    return stockLevels;
  }

  /**
   * Retrieve order history based on provided filters.
   * @param filterDto - Data transfer object containing filter criteria.
   * @returns A list of orders that match the filter criteria.
   */
  async getOrderHistory(filterDto: OrderHistoryFilterDto): Promise<Order[]> {
    const { startDate, endDate, customerName, minTotalAmount, maxTotalAmount } = filterDto;

    const query = this.ordersRepository.createQueryBuilder('order');

    // Apply filters based on the filterDto
    if (startDate) {
      query.andWhere('order.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('order.createdAt <= :endDate', { endDate });
    }

    if (customerName) {
      query.andWhere('order.customerName LIKE :customerName', { customerName: `%${customerName}%` });
    }

    if (minTotalAmount) {
      query.andWhere('order.totalAmount >= :minTotalAmount', { minTotalAmount });
    }

    if (maxTotalAmount) {
      query.andWhere('order.totalAmount <= :maxTotalAmount', { maxTotalAmount });
    }

    // Include related order items
    query.leftJoinAndSelect('order.items', 'orderItem');

    return await query.getMany(); // Execute query and return results
  }

  /**
   * Generate a report of orders within a specified date range.
   * @param startDate - The start date of the reporting period.
   * @param endDate - The end date of the reporting period.
   * @returns A list of orders within the specified date range.
   */
  async getOrderHistoryReport(startDate: string, endDate: string): Promise<any> {
    // Ensure 'createdAt' is used if 'created_at' doesn't exist
    return this.ordersRepository.createQueryBuilder('o')
      .select(['o.customerName', 'o.totalAmount', 'o.createdAt'])
      .where('o.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getMany(); // Execute query and return results
  }
}
