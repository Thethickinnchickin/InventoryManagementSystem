import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditService } from './audit.service';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepository: DeepMockProxy<Repository<Order>>;
  let orderItemsRepository: DeepMockProxy<Repository<OrderItem>>;
  let auditService: DeepMockProxy<AuditService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockDeep<Repository<Order>>(),
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockDeep<Repository<OrderItem>>(),
        },
        {
          provide: AuditService,
          useValue: mockDeep<AuditService>(),
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get(getRepositoryToken(Order)) as DeepMockProxy<Repository<Order>>;
    orderItemsRepository = module.get(getRepositoryToken(OrderItem)) as DeepMockProxy<Repository<OrderItem>>;
    auditService = module.get(AuditService) as DeepMockProxy<AuditService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an order and log the action', async () => {
      const createOrderDto: CreateOrderDto = {
        customerName: 'John Doe',
        shippingAddress: '123 Main St',
        totalAmount: 100,
        items: [{
          productId: 1, quantity: 2, price: 50,
          orderId: 0
        }],
      };

      const savedOrder: Order = {
        id: 1,
        ...createOrderDto,
        items: [], // Mock items will be saved separately
      } as Order;

      const savedOrderItems: OrderItem[] = [{ id: 1, ...createOrderDto.items[0] } as unknown as OrderItem];

      ordersRepository.save.mockResolvedValue(savedOrder);
      //orderItemsRepository.save.mockResolvedValue(savedOrderItems);

      // Optionally mock findOne to return savedOrder
      service.findOne = jest.fn().mockResolvedValue(savedOrder);

      const result = await service.create(createOrderDto);

      expect(result).toEqual(savedOrder);
      expect(auditService.logAction).toHaveBeenCalledWith('Order', savedOrder.id, 'CREATE', createOrderDto);
    });
  });
});
