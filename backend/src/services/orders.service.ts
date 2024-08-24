import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { OrderItem } from '../entities/order-item.entity';
import { AuditService } from './audit.service'; // Import the AuditService

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private readonly auditService: AuditService, // Inject the AuditService
  ) {}
  
  async findAll(page: number = 1, limit: number = 10): Promise<{ orders: Order[], total: number, totalPages: number }> {
    const [orders, total] = await this.ordersRepository.findAndCount({
      where: { deletedAt: null }, // Ensure only non-deleted orders are returned
      relations: ['items', 'items.product'], // Include both items and their associated product
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      orders,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  findOne(id: number): Promise<Order> {
    return this.ordersRepository.findOne({
      where: { id, deletedAt: null }, // Ensure the order is not deleted
      relations: ['items'],
    });
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.ordersRepository.create(createOrderDto);
    const savedOrder = await this.ordersRepository.save(order);

    if (createOrderDto.items) {
      const items = createOrderDto.items.map((item) => ({
        ...item,
        order: savedOrder, // Associate the item with the saved order
      }));
      await this.orderItemsRepository.save(items);
    }

    // Log the creation action
    await this.auditService.logAction('Order', savedOrder.id, 'CREATE', createOrderDto);

    return this.findOne(savedOrder.id);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    // Update the order details
    await this.ordersRepository.update(id, {
      customerName: updateOrderDto.customerName,
      shippingAddress: updateOrderDto.shippingAddress,
      totalAmount: updateOrderDto.totalAmount,
    });

    const existingOrder = await this.findOne(id);

    // Update the order items
    if (updateOrderDto.items) {
      // Delete existing items
      await this.orderItemsRepository.delete({ order: { id } });

      // Insert new items
      const items = updateOrderDto.items.map((item) => ({
        ...item,
        order: existingOrder, // Associate the item with the existing order
      }));
      await this.orderItemsRepository.save(items);
    }

    // Log the update action
    await this.auditService.logAction('Order', id, 'UPDATE', updateOrderDto);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const existingOrder = await this.findOne(id);

    if (existingOrder) {
      

      // Clean up circular references for logging
      const cleanedOrder = this.removeCircularReferences(existingOrder);

      // Log the deletion action
      await this.auditService.logAction('Order', id, 'DELETE', cleanedOrder);

      await this.orderItemsRepository.softDelete({ order: { id } });
      await this.ordersRepository.softDelete(id);
    }
  }

  // Utility function to remove circular references
  private removeCircularReferences(order: Order): Order {
    // Clone the order object
    const cleanedOrder = { ...order };

    // Remove the `order` reference from each item
    cleanedOrder.items = cleanedOrder.items.map((item) => {
      const cleanedItem = { ...item };
      delete cleanedItem.order;
      return cleanedItem;
    });

    return cleanedOrder;
  }

}
