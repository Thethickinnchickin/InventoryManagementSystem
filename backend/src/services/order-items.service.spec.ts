// src/order-items/order-items.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemsService } from './order-items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { Order } from '../entities/order.entity';
import { CreateOrderItemDto } from '../dtos/create-order-item.dto';
import { UpdateOrderItemDto } from '../dtos/update-order-item.dto';
import { AuditService } from './audit.service';

describe('OrderItemsService', () => {
  let service: OrderItemsService;
  let orderItemsRepository: Repository<OrderItem>;
  let productsRepository: Repository<Product>;
  let ordersRepository: Repository<Order>;
  let auditService: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemsService,
        {
          provide: getRepositoryToken(OrderItem),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Product),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Order),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: AuditService,
          useValue: {
            logAction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderItemsService>(OrderItemsService);
    orderItemsRepository = module.get<Repository<OrderItem>>(getRepositoryToken(OrderItem));
    productsRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    ordersRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    auditService = module.get<AuditService>(AuditService);
  });

  describe('findAll', () => {
    it('should return an array of order items', async () => {
      const result = [{ id: 1, quantity: 10, price: 99.99 }] as OrderItem[];
      jest.spyOn(orderItemsRepository, 'find').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single order item by id', async () => {
      const result = { id: 1, quantity: 10, price: 99.99 } as OrderItem;
      jest.spyOn(orderItemsRepository, 'findOneBy').mockResolvedValue(result);

      expect(await service.findOne(1)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create and return a new order item and log the action', async () => {
      const createOrderItemDto: CreateOrderItemDto = { quantity: 10, price: 99.99, orderId: 1, productId: 1 };
      const savedOrderItem = { id: 1, ...createOrderItemDto } as unknown as OrderItem;
      jest.spyOn(orderItemsRepository, 'create').mockReturnValue(savedOrderItem);
      jest.spyOn(orderItemsRepository, 'save').mockResolvedValue(savedOrderItem);

      await service.create(createOrderItemDto);

      expect(orderItemsRepository.create).toHaveBeenCalledWith(createOrderItemDto);
      expect(orderItemsRepository.save).toHaveBeenCalledWith(savedOrderItem);
      expect(auditService.logAction).toHaveBeenCalledWith(
        'OrderItem',
        savedOrderItem.id,
        'CREATE',
        createOrderItemDto
      );
    });
  });

  describe('update', () => {
    it('should update and return the order item and log the action', async () => {
      const updateOrderItemDto: UpdateOrderItemDto = { quantity: 20, price: 89.99, orderId: 2, productId: 2 };
      const existingOrderItem = { id: 1, quantity: 10, price: 99.99 } as OrderItem;
      const updatedOrderItem = { ...existingOrderItem, ...updateOrderItemDto } as OrderItem;
      
      jest.spyOn(orderItemsRepository, 'findOneBy').mockResolvedValue(existingOrderItem);
      jest.spyOn(productsRepository, 'findOneBy').mockResolvedValue({ id: 2 } as Product);
      jest.spyOn(ordersRepository, 'findOneBy').mockResolvedValue({ id: 2 } as Order);
      jest.spyOn(orderItemsRepository, 'save').mockResolvedValue(updatedOrderItem);

      await service.update(1, updateOrderItemDto);

      expect(orderItemsRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(productsRepository.findOneBy).toHaveBeenCalledWith({ id: 2 });
      expect(ordersRepository.findOneBy).toHaveBeenCalledWith({ id: 2 });
      expect(orderItemsRepository.save).toHaveBeenCalledWith(updatedOrderItem);
      expect(auditService.logAction).toHaveBeenCalledWith(
        'OrderItem',
        1,
        'UPDATE',
        updateOrderItemDto
      );
    });

    it('should throw an error if the order item is not found', async () => {
      const updateOrderItemDto: UpdateOrderItemDto = {
          quantity: 20,
          price: 0,
          orderId: 0,
          productId: 0
      };
      jest.spyOn(orderItemsRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.update(1, updateOrderItemDto)).rejects.toThrow('OrderItem not found');
    });
  });

  describe('remove', () => {
    it('should delete the order item and log the action', async () => {
      const existingOrderItem = { id: 1, quantity: 10, price: 99.99 } as OrderItem;
      jest.spyOn(orderItemsRepository, 'findOneBy').mockResolvedValue(existingOrderItem);
      jest.spyOn(orderItemsRepository, 'delete').mockResolvedValue(undefined);

      await service.remove(1);

      expect(orderItemsRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(orderItemsRepository.delete).toHaveBeenCalledWith(1);
      expect(auditService.logAction).toHaveBeenCalledWith(
        'OrderItem',
        1,
        'DELETE',
        existingOrderItem
      );
    });
  });
});
