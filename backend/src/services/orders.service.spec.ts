import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { OrdersService } from './orders.service';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { AuditService } from './audit.service';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { User } from '../entities/user.entity';

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let ordersRepository: Repository<Order>;
  let orderItemsRepository: Repository<OrderItem>;
  let productsRepository: Repository<Product>;
  let auditService: AuditService;
  const mockOrder: Order = { id: 1, customerName: 'John Doe', items: [] } as Order;
  const mockOrderItem: OrderItem = {
    id: 1,
    quantity: 2,
    price: 50,
    product: { id: 1, name: 'Product 1', categories: [] } as Product,
    order: mockOrder,
  } as OrderItem;
  const mockUser: User = { id: 1, username: 'johndoe', password: 'hashedpassword' } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: {
            find: jest.fn(),           // Add this line
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: {
            save: jest.fn(),
            delete: jest.fn(),
            softDelete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Product),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: AuditService,
          useValue: { logAction: jest.fn() },
        },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    orderItemsRepository = module.get<Repository<OrderItem>>(getRepositoryToken(OrderItem));
    productsRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    auditService = module.get<AuditService>(AuditService);
  });

  describe('findAll', () => {
    it('should return paginated orders', async () => {
      const mockOrders: Order[] = [{ id: 1, customerName: 'John Doe', items: [] } as Order];
      const mockTotal = 1;
      const mockTotalPages = 1;

      jest.spyOn(ordersRepository, 'findAndCount').mockResolvedValue([mockOrders, mockTotal]);

      const result = await ordersService.findAll(1, 10);

      expect(result.orders).toEqual(mockOrders);
      expect(result.total).toBe(mockTotal);
      expect(result.totalPages).toBe(mockTotalPages);
    });
  });

  describe('findOne', () => {
    it('should return an order by ID', async () => {
      const mockOrder: Order = { id: 1, customerName: 'John Doe', items: [] } as Order;

      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(mockOrder);

      const result = await ordersService.findOne(1);

      expect(result).toEqual(mockOrder);
    });
  });

  describe('findOrdersByUser', () => {
    it('should return orders by user ID', async () => {
      const mockOrders: Order[] = [
        {
          id: 1,
          customerName: 'John Doe',
          items: [
            {
              id: 1,
              quantity: 3,
              price: 60,
              product: { id: 1, name: 'Product 1', categories: [] } as Product,
              order: {} as Order,
            },
          ],
        } as Order,
      ];

      // Mock the find method on the repository
      jest.spyOn(ordersRepository, 'find').mockResolvedValue(mockOrders);

      // Call the service method
      const result = await ordersService.findOrdersByUser(1);

      // Check the result
      expect(result).toEqual(mockOrders);
    });
  });
  
  
  describe('create', () => {
    it('should create a new order and return it', async () => {
      const createOrderDto: CreateOrderDto = {
        customerName: 'John Doe',
        shippingAddress: '123 Main St',
        totalAmount: 100,
        items: [{ productId: 1, quantity: 2, price: 50, orderId: 1 }],
        user: mockUser,
      };
      

      const mockProduct: Product = { id: 1, name: 'Product 1', categories: [] } as Product;
      const mockOrder: Order = { 
        id: 1, 
        customerName: 'John Doe', 
        shippingAddress: '123 Main St',
        totalAmount: 100,
        items: [mockOrderItem],
        user: mockUser,
      } as Order;

      jest.spyOn(productsRepository, 'findOneBy').mockResolvedValue(mockProduct);
      jest.spyOn(ordersRepository, 'create').mockReturnValue(mockOrder);
      jest.spyOn(ordersRepository, 'save').mockResolvedValue(mockOrder);
      jest.spyOn(orderItemsRepository, 'save').mockResolvedValue(mockOrderItem);
      jest.spyOn(auditService, 'logAction').mockResolvedValue(undefined);



    const result = await ordersService.create(createOrderDto);


      

      expect(result).toEqual(mockOrder);
      expect(auditService.logAction).toHaveBeenCalledWith('Order', mockOrder.id, 'CREATE', createOrderDto);
    });

    it('should throw an error if a product is not found', async () => {
      const createOrderDto: CreateOrderDto = {
        customerName: 'John Doe',
        shippingAddress: '123 Main St',
        totalAmount: 100,
        items: [{ productId: 999, quantity: 2, price: 50, orderId: 0 }],
        user: new User(),
      };

      jest.spyOn(productsRepository, 'findOneBy').mockResolvedValue(null);

      await expect(ordersService.create(createOrderDto)).rejects.toThrow('Product with ID 999 not found');
    });
  });

describe('update', () => {
  it('should update an existing order and return it', async () => {
    const existingOrder: Order = {
      id: 1,
      customerName: 'John Doe',
      shippingAddress: '123 Main St',
      totalAmount: 100,
      items: [
        {
          id: 1,
          quantity: 2,
          price: 50,
          product: { id: 1, name: 'Product 1', categories: [] } as Product,
          order: { id: 1 } as Order, 
        } as OrderItem
      ],
    } as Order;

    const updateOrderDto: UpdateOrderDto = {
      customerName: 'Jane Doe',
      shippingAddress: '456 Elm St',
      totalAmount: 200,
      items: [
        {
          id: 1,
          quantity: 3,
          price: 60,
          product: { id: 1, name: 'Product 1', categories: [] } as Product,
          order: { id: 1 } as Order,
        } as OrderItem
      ],
    };

    const updatedOrder: Order = {
      id: 1,
      customerName: 'Jane Doe',
      shippingAddress: '456 Elm St',
      totalAmount: 200,
      items: [
        {
          id: 1,
          quantity: 3,
          price: 60,
          product: { id: 1, name: 'Product 1', categories: [] } as Product,
          order: { id: 1 } as Order,
        } as OrderItem
      ],
    } as Order;

    // Mock the findOne to return the original order first, and the updated order later
    jest.spyOn(ordersRepository, 'findOne')
      .mockResolvedValueOnce(existingOrder) // Before update
      .mockResolvedValueOnce(updatedOrder); // After update

    jest.spyOn(ordersRepository, 'update').mockResolvedValue({
      affected: 1,
      raw: {} as any,
      generatedMaps: [] as any[],
    } as UpdateResult);

    jest.spyOn(orderItemsRepository, 'delete').mockResolvedValue({
      affected: 1,
      raw: {} as any,
    } as DeleteResult);

    jest.spyOn(orderItemsRepository, 'save').mockResolvedValue(updateOrderDto.items[0]);

    jest.spyOn(auditService, 'logAction').mockResolvedValue(undefined);

    const result = await ordersService.update(1, updateOrderDto);

    expect(result).toEqual(updatedOrder);
    expect(auditService.logAction).toHaveBeenCalledWith('Order', 1, 'UPDATE', updateOrderDto);
  });
});

  

describe('remove', () => {
    it('should remove an order and its items', async () => {
      // Mock ordersRepository.findOne to return a valid order
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(mockOrder); 
      
      // Mocking auditService and repository operations
      jest.spyOn(auditService, 'logAction').mockResolvedValue(undefined);
      jest.spyOn(orderItemsRepository, 'softDelete').mockResolvedValue({
        affected: 1,
        raw: {} as any,
      } as UpdateResult);
      
      jest.spyOn(ordersRepository, 'softDelete').mockResolvedValue({
        affected: 1,
        raw: {} as any,
      } as UpdateResult);
  
      // Call remove method
      await ordersService.remove(1);
  
      // Expect auditService logAction to be called with correct arguments
      expect(auditService.logAction).toHaveBeenCalledWith('Order', 1, 'DELETE', mockOrder);
    });
  });
  
  
});
