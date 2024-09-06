import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { OrderItem } from '../entities/order-item.entity';
import { AuditService } from './audit.service';
import { Product } from 'src/entities/product.entity';

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

  async findAll(
    page: number = 1,
    limit: number = 10,
    customerName?: string,
    startDate?: string,
    endDate?: string
  ): Promise<{ orders: Order[], total: number, totalPages: number }> {
    const queryOptions: any = {
      where: { deletedAt: null },
      relations: ['items', 'items.product'],
      skip: (page - 1) * limit,
      take: limit,
    };

    if (customerName) {
      queryOptions.where.customerName = customerName;
    }

    const [orders, total] = await this.ordersRepository.findAndCount(queryOptions);

    return {
      orders,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(orderId: number): Promise<Order> {
    return this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'], // Ensure the product is included in the relations.
    });
  }
  

  async findOrdersByUser(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { user: { id: userId } },
      relations: ['items'],  // Optionally include related entities
    });
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.ordersRepository.create(createOrderDto);
    const savedOrder = await this.ordersRepository.save(order);
  
    if (createOrderDto.items && createOrderDto.items.length > 0) {
      const items: DeepPartial<OrderItem>[] = await Promise.all(
        createOrderDto.items.map(async item => {
          const product = await this.productsRepository.findOneBy({ id: item.productId }); // Find the product by productId
          if (!product) {
            throw new Error(`Product with ID ${item.productId} not found`);
          }
          return {
            ...item,
            order: savedOrder,
            product, // Associate the product with the order item
          };
        })
      );
  
      await this.orderItemsRepository.save(items);
    }
  
    await this.auditService.logAction('Order', savedOrder.id, 'CREATE', createOrderDto);
  
    return this.findOne(savedOrder.id);
  }
  
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    await this.ordersRepository.update(id, {
      customerName: updateOrderDto.customerName,
      shippingAddress: updateOrderDto.shippingAddress,
      totalAmount: updateOrderDto.totalAmount,
    });

    const existingOrder = await this.findOne(id);

    if (updateOrderDto.items && updateOrderDto.items.length > 0) {
      await this.orderItemsRepository.delete({ order: { id } });
      const items: DeepPartial<OrderItem>[] = updateOrderDto.items.map(item => ({
        ...item,
        order: existingOrder,
      }));
      await this.orderItemsRepository.save(items);
    }

    await this.auditService.logAction('Order', id, 'UPDATE', updateOrderDto);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const existingOrder = await this.findOne(id);

    if (existingOrder) {
      const cleanedOrder = this.removeCircularReferences(existingOrder);
      await this.auditService.logAction('Order', id, 'DELETE', cleanedOrder);

      await this.orderItemsRepository.softDelete({ order: { id } });
      await this.ordersRepository.softDelete(id);
    }
  }

  private removeCircularReferences(order: Order): Order {
    const cleanedOrder = { ...order };
    cleanedOrder.items = cleanedOrder.items.map(item => {
      const cleanedItem = { ...item };
      delete cleanedItem.order;
      return cleanedItem;
    });
    return cleanedOrder;
  }
}
