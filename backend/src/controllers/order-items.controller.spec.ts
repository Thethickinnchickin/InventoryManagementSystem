import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemsController } from './order-items.controller';
import { OrderItemsService } from '../services/order-items.service';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderItemDto } from '../dtos/create-order-item.dto';
import { UpdateOrderItemDto } from '../dtos/update-order-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../entities/user.entity';

describe('OrderItemsController', () => {
  let controller: OrderItemsController;
  let service: OrderItemsService;

  const mockOrderItemsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderItemsController],
      providers: [
        {
          provide: OrderItemsService,
          useValue: mockOrderItemsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<OrderItemsController>(OrderItemsController);
    service = module.get<OrderItemsService>(OrderItemsService);
  });

  describe('findAll', () => {
    it('should return an array of order items', async () => {
      const result: OrderItem[] = [
        { id: 1, quantity: 10, price: 100, orderId: 1, productId: 1 } as unknown as OrderItem,
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single order item', async () => {
      const result: OrderItem = { id: 1, quantity: 10, price: 100, orderId: 1, productId: 1 } as unknown as OrderItem;
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(1)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create and return an order item', async () => {
      const createOrderItemDto: CreateOrderItemDto = { orderId: 1, productId: 1, quantity: 5, price: 50 };
      const result: OrderItem = { id: 1, ...createOrderItemDto } as unknown as OrderItem;
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createOrderItemDto)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update and return an order item', async () => {
      const updateOrderItemDto: UpdateOrderItemDto = { quantity: 15, price: 75, orderId: 1, productId: 1 };
      const result: OrderItem = { id: 1, ...updateOrderItemDto } as unknown as OrderItem;
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(1, updateOrderItemDto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove an order item', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await expect(controller.remove(1)).resolves.toBeUndefined();
    });
  });
});
