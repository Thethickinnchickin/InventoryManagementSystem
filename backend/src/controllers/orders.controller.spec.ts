import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from '../services/orders.service';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../entities/user.entity';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({})
    .overrideGuard(RolesGuard)
    .useValue({})
    .compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of orders with pagination and filters', async () => {
      const result = {
        orders: [
          {
            id: 1,
            customerName: 'John Doe',
            totalAmount: 200,
            shippingAddress: '123 Main St',
            items: [], // Adjust this to match the actual structure
            deletedAt: null,
            createdAt: new Date(),
          },
        ],
        total: 1,
        totalPages: 1,
      };
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll(1, 10, 'John Doe', '2024-01-01', '2024-12-31')).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single order', async () => {
      const result: Order = {
        id: 1,
        customerName: 'John Doe',
        totalAmount: 200,
        shippingAddress: '123 Main St',
        items: [], // Adjust this to match the actual structure
        deletedAt: null,
        createdAt: new Date(),
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(1)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create and return a new order', async () => {
      const createOrderDto: CreateOrderDto = {
        customerName: 'John Doe',
        totalAmount: 200,
        shippingAddress: '123 Main St',
        items: [], // Adjust this to match the actual structure
      };
      const result: Order = {
        id: 1,
        customerName: 'John Doe',
        totalAmount: 200,
        shippingAddress: '123 Main St',
        items: [], // Adjust this to match the actual structure
        deletedAt: null,
        createdAt: new Date(),
      };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createOrderDto)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update and return the updated order', async () => {
      const updateOrderDto: UpdateOrderDto = {
        customerName: 'Jane Doe',
        totalAmount: 250,
        shippingAddress: '456 Elm St',
        items: [], // Adjust this to match the actual structure
      };
      const result: Order = {
        id: 1,
        customerName: 'Jane Doe',
        totalAmount: 250,
        shippingAddress: '456 Elm St',
        items: [], // Adjust this to match the actual structure
        deletedAt: null,
        createdAt: new Date(),
      };
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(1, updateOrderDto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove the order', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue();

      expect(await controller.remove(1)).toBeUndefined();
    });
  });
});
