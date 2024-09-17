import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { OrderItem } from '../entities/order-item.entity';
import { AuditService } from './audit.service';
import { Product } from '../entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private productsRepository: Repository<Product>,

    private readonly auditService: AuditService,
  ) {}

  /**
   * Retrieve a paginated list of orders with optional filters for customer name and date range.
   * @param page - Current page number (1-based).
   * @param limit - Number of orders per page.
   * @param customerName - Optional filter for orders by customer name.
   * @param startDate - Optional start date for filtering orders.
   * @param endDate - Optional end date for filtering orders.
   * @returns An object containing order data, total count, and total pages.
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    customerName?: string,
    startDate?: string,
    endDate?: string
  ): Promise<{ orders: Order[], total: number, totalPages: number }> {
    const queryOptions: any = {
      where: { deletedAt: null }, // Exclude soft-deleted orders
      relations: ['items', 'items.product'], // Load related order items and products
      skip: (page - 1) * limit,
      take: limit,
    };

    // Apply filters based on optional parameters
    if (customerName) {
      queryOptions.where.customerName = customerName;
    }
    
    if (startDate && endDate) {
      queryOptions.where.timestamp = {
        $gte: new Date(startDate), // Filter orders from the start date
        $lte: new Date(endDate),   // Filter orders up to the end date
      };
    }

    const [orders, total] = await this.ordersRepository.findAndCount(queryOptions);

    return {
      orders,
      total,
      totalPages: Math.ceil(total / limit), // Calculate total pages
    };
  }

  /**
   * Retrieve a single order by its ID.
   * @param orderId - The ID of the order to retrieve.
   * @returns The order entity.
   * @throws NotFoundException if the order does not exist.
   */
  async findOne(orderId: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'], // Load related items and products
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  /**
   * Retrieve all orders associated with a specific user.
   * @param userId - The ID of the user.
   * @returns An array of orders associated with the specified user.
   */
  async findOrdersByUser(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { user: { id: userId } }, // Filter by user ID
      relations: ['items'], // Load related order items
    });
  }

  /**
   * Create a new order and its associated items.
   * @param createOrderDto - Data transfer object containing order details.
   * @returns The created order entity.
   * @throws NotFoundException if any product in the order items does not exist.
   */
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.ordersRepository.create(createOrderDto); // Create order entity
    const savedOrder = await this.ordersRepository.save(order); // Save order entity

    // Create and save order items if provided
    if (createOrderDto.items && createOrderDto.items.length > 0) {
      const items: DeepPartial<OrderItem>[] = await Promise.all(
        createOrderDto.items.map(async item => {
          const product = await this.productsRepository.findOneBy({ id: item.productId });
          if (!product) {
            throw new NotFoundException(`Product with ID ${item.productId} not found`);
          }
          return {
            ...item,
            order: savedOrder,
            product,
          };
        })
      );

      await this.orderItemsRepository.save(items);
    }

    await this.auditService.logAction('Order', savedOrder.id, 'CREATE', createOrderDto); // Log creation action
    return savedOrder;
  }

  /**
   * Update an existing order by its ID.
   * @param id - The ID of the order to update.
   * @param updateOrderDto - Data transfer object containing updated order details.
   * @returns The updated order entity.
   * @throws NotFoundException if the order does not exist.
   */
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const existingOrder = await this.findOne(id);

    // Update order properties based on DTO values
    if (updateOrderDto.customerName) {
      existingOrder.customerName = updateOrderDto.customerName;
    }
    if (updateOrderDto.shippingAddress) {
      existingOrder.shippingAddress = updateOrderDto.shippingAddress;
    }
    if (updateOrderDto.totalAmount) {
      existingOrder.totalAmount = updateOrderDto.totalAmount;
    }

    await this.ordersRepository.save(existingOrder); // Save updated order

    // Update order items if provided in the DTO
    if (updateOrderDto.items && updateOrderDto.items.length > 0) {
      await this.orderItemsRepository.delete({ order: { id } }); // Delete existing items
      const items: DeepPartial<OrderItem>[] = updateOrderDto.items.map(item => ({
        ...item,
        order: existingOrder,
      }));
      await this.orderItemsRepository.save(items); // Save updated items
    }

    const updatedOrder = await this.findOne(id); // Retrieve updated order

    await this.auditService.logAction('Order', id, 'UPDATE', updateOrderDto); // Log update action

    return updatedOrder;
  }

  /**
   * Soft delete an order by its ID.
   * @param id - The ID of the order to remove.
   * @throws NotFoundException if the order does not exist.
   */
  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await this.orderItemsRepository.softDelete({ order: { id } }); // Soft delete associated items
    await this.ordersRepository.softDelete(id); // Soft delete order

    await this.auditService.logAction('Order', id, 'DELETE', order); // Log deletion action
  }
}
