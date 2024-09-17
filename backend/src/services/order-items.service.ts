import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderItemDto } from '../dtos/create-order-item.dto';
import { UpdateOrderItemDto } from '../dtos/update-order-item.dto';
import { AuditService } from './audit.service';
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

  /**
   * Retrieve all order items.
   * @returns An array of order items.
   */
  async findAll(): Promise<OrderItem[]> {
    return this.orderItemsRepository.find(); // Fetch all order items
  }

  /**
   * Retrieve a single order item by its ID.
   * @param id - The ID of the order item to retrieve.
   * @returns The order item entity.
   * @throws NotFoundException if the order item does not exist.
   */
  async findOne(id: number): Promise<OrderItem> {
    const orderItem = await this.orderItemsRepository.findOneBy({ id });
    if (!orderItem) {
      throw new NotFoundException('OrderItem not found'); // Use NotFoundException for consistency
    }
    return orderItem;
  }

  /**
   * Create a new order item.
   * @param createOrderItemDto - Data transfer object containing order item details.
   * @returns The created order item entity.
   */
  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const orderItem = this.orderItemsRepository.create(createOrderItemDto); // Create order item entity
    const savedOrderItem = await this.orderItemsRepository.save(orderItem); // Save order item entity

    // Log the creation action
    await this.auditService.logAction('OrderItem', savedOrderItem.id, 'CREATE', createOrderItemDto);

    return savedOrderItem;
  }

  /**
   * Update an existing order item by its ID.
   * @param id - The ID of the order item to update.
   * @param updateOrderItemDto - Data transfer object containing updated order item details.
   * @returns The updated order item entity.
   * @throws NotFoundException if the order item, order, or product does not exist.
   */
  async update(id: number, updateOrderItemDto: UpdateOrderItemDto): Promise<OrderItem> {
    const orderItem = await this.findOne(id); // Find the order item first
    if (!orderItem) {
      throw new NotFoundException('OrderItem not found'); // Use NotFoundException for consistency
    }

    // Update order item properties based on DTO values
    if (updateOrderItemDto.quantity !== undefined) {
      orderItem.quantity = updateOrderItemDto.quantity;
    }
    if (updateOrderItemDto.price !== undefined) {
      orderItem.price = updateOrderItemDto.price;
    }
    if (updateOrderItemDto.orderId !== undefined) {
      const order = await this.ordersRepository.findOneBy({ id: updateOrderItemDto.orderId });
      if (!order) {
        throw new NotFoundException('Order not found'); // Handle case where the order does not exist
      }
      orderItem.order = order;
    }
    if (updateOrderItemDto.productId !== undefined) {
      const product = await this.productsRepository.findOneBy({ id: updateOrderItemDto.productId });
      if (!product) {
        throw new NotFoundException('Product not found'); // Handle case where the product does not exist
      }
      orderItem.product = product;
    }

    const updatedOrderItem = await this.orderItemsRepository.save(orderItem); // Save updated order item

    // Log the update action
    await this.auditService.logAction('OrderItem', id, 'UPDATE', updateOrderItemDto);

    return updatedOrderItem;
  }

  /**
   * Remove an order item by its ID.
   * @param id - The ID of the order item to remove.
   * @throws NotFoundException if the order item does not exist.
   */
  async remove(id: number): Promise<void> {
    const orderItem = await this.findOne(id); // Find the order item first
    if (!orderItem) {
      throw new NotFoundException('OrderItem not found'); // Use NotFoundException for consistency
    }

    await this.orderItemsRepository.delete(id); // Delete the order item

    // Log the deletion action
    await this.auditService.logAction('OrderItem', id, 'DELETE', orderItem);
  }
}
