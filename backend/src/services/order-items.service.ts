import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderItemDto } from '../dtos/create-order-item.dto';
import { UpdateOrderItemDto } from '../dtos/update-order-item.dto';
import { AuditService } from './audit.service'; // Import the AuditService
import { Product } from '../entities/product.entity';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private productsRepository: Repository<Product>,

    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,

    private readonly auditService: AuditService
  ) {}

  findAll(): Promise<OrderItem[]> {
    return this.orderItemsRepository.find();
  }

  findOne(id: number): Promise<OrderItem> {
    return this.orderItemsRepository.findOneBy({ id });
  }

  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const orderItem = this.orderItemsRepository.create(createOrderItemDto);
    const savedOrderItem = await this.orderItemsRepository.save(orderItem);

    // Log the creation action
    await this.auditService.logAction('OrderItem', savedOrderItem.id, 'CREATE', createOrderItemDto);

    return savedOrderItem;
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto): Promise<OrderItem> {
    const orderItem = await this.findOne(id);
    if (!orderItem) {
      throw new Error('OrderItem not found');
    }

    if (updateOrderItemDto.quantity !== undefined) {
      orderItem.quantity = updateOrderItemDto.quantity;
    }
    if (updateOrderItemDto.price !== undefined) {
      orderItem.price = updateOrderItemDto.price;
    }
    if (updateOrderItemDto.orderId !== undefined) {
      const order = await this.ordersRepository.findOneBy({ id: updateOrderItemDto.orderId });
      orderItem.order = order;
    }
    if (updateOrderItemDto.productId !== undefined) {
      const product = await this.productsRepository.findOneBy({ id: updateOrderItemDto.productId });
      orderItem.product = product;
    }

    const updatedOrderItem = await this.orderItemsRepository.save(orderItem);

    await this.auditService.logAction('OrderItem', id, 'UPDATE', updateOrderItemDto);

    return updatedOrderItem;
  }

  async remove(id: number): Promise<void> {
    const orderItem = await this.findOne(id);
    await this.orderItemsRepository.delete(id);

    // Log the deletion action
    await this.auditService.logAction('OrderItem', id, 'DELETE', orderItem);
  }
}
