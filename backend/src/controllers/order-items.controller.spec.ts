import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemsController } from './order-items.controller';
import { OrderItemsService } from '../services/order-items.service';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderItemDto } from '../dtos/create-order-item.dto';
import { UpdateOrderItemDto } from '../dtos/update-order-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';

describe('OrderItemsController', () => {
  let controller: OrderItemsController;
  let service: OrderItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderItemsController],
      providers: [
        {
          provide: OrderItemsService,
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

    controller = module.get<OrderItemsController>(OrderItemsController);
    service = module.get<OrderItemsService>(OrderItemsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of order items', async () => {
      const result: OrderItem[] = [{
          id: 1, quantity: 10, price: 100,
          order: new Order,
          product: new Product
      }]; // Include all required properties
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single order item', async () => {
      const result: OrderItem = {
          id: 1, quantity: 10, price: 100,
          order: new Order,
          product: new Product
      }; // Include all required properties
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(1)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create and return a new order item', async () => {
      const createOrderItemDto: CreateOrderItemDto = {
          quantity: 10, price: 100,
          orderId: 0,
          productId: 0
      }; // Include required properties
      const result: OrderItem = {
          id: 1, quantity: 10, price: 100,
          order: new Order,
          product: new Product
      }; // Include all required properties
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createOrderItemDto)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update and return the updated order item', async () => {
      const updateOrderItemDto: UpdateOrderItemDto = {
          quantity: 15, price: 150,
          orderId: 0,
          productId: 0
      }; // Include required properties
      const result: OrderItem = {
          id: 1, quantity: 15, price: 150,
          order: new Order,
          product: new Product
      }; // Include all required properties
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(1, updateOrderItemDto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove the order item', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue();

      expect(await controller.remove(1)).toBeUndefined();
    });
  });
});
