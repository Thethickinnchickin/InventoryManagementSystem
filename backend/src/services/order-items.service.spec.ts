import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemsService } from './order-items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderItem } from '../entities/order-item.entity';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Order } from '../entities/order.entity';
import { AuditService } from './audit.service';
import { CreateOrderItemDto } from '../dtos/create-order-item.dto';
import { UpdateOrderItemDto } from '../dtos/update-order-item.dto';

describe('OrderItemsService', () => {
  let service: OrderItemsService;
  let orderItemsRepository: Repository<OrderItem>;
  let productsRepository: Repository<Product>;
  let ordersRepository: Repository<Order>;
  let auditService: AuditService;

  const mockOrderItem = {
    id: 1,
    quantity: 2,
    price: 100,
    product: { id: 1, name: 'Test Product' },
    order: { id: 1 },
  } as OrderItem;

  const mockProduct = { id: 1, name: 'Test Product' } as Product;
  const mockOrder = { id: 1 } as Order;

  const mockAuditService = {
    logAction: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemsService,
        {
          provide: getRepositoryToken(OrderItem),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
        {
          provide: AuditService,
          useValue: mockAuditService,
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
    it('should return all order items', async () => {
      jest.spyOn(orderItemsRepository, 'find').mockResolvedValue([mockOrderItem]);

      const result = await service.findAll();

      expect(result).toEqual([mockOrderItem]);
    });
  });

  describe('findOne', () => {
    it('should return an order item by id', async () => {
      jest.spyOn(orderItemsRepository, 'findOneBy').mockResolvedValue(mockOrderItem);

      const result = await service.findOne(1);

      expect(result).toEqual(mockOrderItem);
    });
  });

  describe('create', () => {
    it('should create a new order item and log the action', async () => {
      const createOrderItemDto: CreateOrderItemDto = {
        quantity: 2,
        price: 100,
        orderId: 1,
        productId: 1,
      };

      jest.spyOn(orderItemsRepository, 'create').mockReturnValue(mockOrderItem);
      jest.spyOn(orderItemsRepository, 'save').mockResolvedValue(mockOrderItem);

      const result = await service.create(createOrderItemDto);

      expect(result).toEqual(mockOrderItem);
      expect(auditService.logAction).toHaveBeenCalledWith('OrderItem', 1, 'CREATE', createOrderItemDto);
    });
  });

  describe('update', () => {
    it('should update an existing order item and log the action', async () => {
      const updateOrderItemDto: UpdateOrderItemDto = {
        quantity: 5,
        price: 200,
        productId: 1,
        orderId: 1,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockOrderItem);
      jest.spyOn(productsRepository, 'findOneBy').mockResolvedValue(mockProduct);
      jest.spyOn(ordersRepository, 'findOneBy').mockResolvedValue(mockOrder);
      jest.spyOn(orderItemsRepository, 'save').mockResolvedValue(mockOrderItem);

      const result = await service.update(1, updateOrderItemDto);

      expect(result).toEqual(mockOrderItem);
      expect(auditService.logAction).toHaveBeenCalledWith('OrderItem', 1, 'UPDATE', updateOrderItemDto);
    });

    it('should throw an error if the order item is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(undefined);

      const updateOrderItemDto: UpdateOrderItemDto = {
          quantity: 5, price: 200,
          orderId: 0,
          productId: 0
      };

      await expect(service.update(1, updateOrderItemDto)).rejects.toThrowError('OrderItem not found');
    });
  });

  describe('remove', () => {
    it('should remove an order item and log the action', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockOrderItem);
      jest.spyOn(orderItemsRepository, 'delete').mockResolvedValue({ affected: 1 } as any);

      await service.remove(1);

      expect(auditService.logAction).toHaveBeenCalledWith('OrderItem', 1, 'DELETE', mockOrderItem);
    });
  });
});
