import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Order } from 'src/entities/order.entity';
import { OrderHistoryFilterDto } from 'src/dtos/order-history-filter.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  // Method to get stock levels
  async getStockLevels(): Promise<Product[]> {
    return this.productsRepository.find({
      select: ['name', 'stock'],
      order: { stock: 'ASC' }, // Orders products by stock quantity, from lowest to highest
    });
  }

  async getOrderHistory(filterDto: OrderHistoryFilterDto): Promise<Order[]> {
    const { startDate, endDate, customerName, minTotalAmount, maxTotalAmount } = filterDto;

    const query = this.ordersRepository.createQueryBuilder('order');

    // Apply filters
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

    return await query.getMany();
  }
}

