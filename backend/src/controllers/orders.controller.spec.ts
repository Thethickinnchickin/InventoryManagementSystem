import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from '../services/orders.service';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { User, UserRole } from '../entities/user.entity';
import { AuthenticatedRequest } from 'src/types/express-request.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mock } from 'jest-mock-extended';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrder: Order = {
    id: 1,
    customerName: 'John Doe',
    shippingAddress: '123 Main St',
    totalAmount: 100.00,
    items: [],
    user: { id: 1, username: 'testuser', password: 'hashedpassword', role: UserRole.ADMIN } as User,
    deletedAt: null,
    createdAt: new Date(),
  };

  const mockOrderService = {
    findAll: jest.fn().mockResolvedValue({ orders: [mockOrder], total: 1, totalPages: 1 }),
    findOne: jest.fn().mockResolvedValue(mockOrder),
    findOrdersByUser: jest.fn().mockResolvedValue([mockOrder]),
    create: jest.fn().mockResolvedValue(mockOrder),
    update: jest.fn().mockResolvedValue(mockOrder),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrderService,
        },
        {
          provide: getRepositoryToken(Order),
          useValue: mock(Repository),
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  describe('findAll', () => {
    it('should return a paginated list of orders', async () => {
      const result = await controller.findAll(1, 10, undefined, undefined, undefined);
      expect(result).toEqual({ orders: [mockOrder], total: 1, totalPages: 1 });
    });
  });

  describe('findOne', () => {
    it('should return a single order by id', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('findByUser', () => {
    it('should return orders for a user', async () => {
      const mockRequest: AuthenticatedRequest = {
        user: { id: 1, role: UserRole.USER, password: 'hashedpassword' } as User,
      } as unknown as AuthenticatedRequest;

      const result = await controller.findByUser(mockRequest);
      expect(result).toEqual([mockOrder]);
    });
  });

  describe('create', () => {
    it('should create and return an order', async () => {
      const createOrderDto: CreateOrderDto = {
        customerName: 'John Doe',
        shippingAddress: '123 Main St',
        totalAmount: 100.00,
        items: [],
        user: mockOrder.user,
      };
      const mockRequest: AuthenticatedRequest = {
        user: { id: 1, role: UserRole.USER, password: 'hashedpassword' } as User,
      } as unknown as AuthenticatedRequest;

      const result = await controller.create(createOrderDto, mockRequest);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('update', () => {
    it('should update and return an order', async () => {
      const updateOrderDto: UpdateOrderDto = {
          customerName: 'Jane Doe',
          shippingAddress: '456 Another St',
          totalAmount: 200.00,
          items: []
      };

      const result = await controller.update(1, updateOrderDto);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('remove', () => {
    it('should remove an order by id', async () => {
      await expect(controller.remove(1)).resolves.toBeUndefined();
    });
  });
});
