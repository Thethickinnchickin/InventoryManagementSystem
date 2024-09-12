// src/orders/dto/create-order.dto.spec.ts
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateOrderDto } from './create-order.dto';
import { CreateOrderItemDto } from './create-order-item.dto';
import { User } from '../entities/user.entity';

describe('CreateOrderDto', () => {
  let dto: CreateOrderDto;

  beforeEach(() => {
    dto = new CreateOrderDto();
  });

  it('should succeed with valid data', async () => {
    const validOrderItem: CreateOrderItemDto = {
        productId: 1,
        quantity: 2,
        price: 20.50,
        orderId: 0
    };

    const validOrder = {
      customerName: 'John Doe',
      shippingAddress: '1234 Main St',
      totalAmount: 50.75,
      items: [validOrderItem],
    };

    const orderDto = plainToInstance(CreateOrderDto, validOrder);
    const errors = await validate(orderDto);

    expect(errors.length).toBe(0);
  });

  it('should fail if customerName is empty', async () => {
    const validOrderItem: CreateOrderItemDto = {
        productId: 1,
        quantity: 2,
        price: 20.50,
        orderId: 0
    };

    const invalidOrder = {
      customerName: '',
      shippingAddress: '1234 Main St',
      totalAmount: 50.75,
      items: [validOrderItem]
    };

    const orderDto = plainToInstance(CreateOrderDto, invalidOrder);
    const errors = await validate(orderDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('customerName');
  });

  it('should fail if totalAmount is not a decimal', async () => {
    const validOrderItem: CreateOrderItemDto = {
        productId: 1,
        quantity: 2,
        price: 20.50,
        orderId: 0
    };

    const invalidOrder = {
      customerName: 'John Doe',
      shippingAddress: '1234 Main St',
      totalAmount: 'invalid',
      items: [validOrderItem]
    };

    const orderDto = plainToInstance(CreateOrderDto, invalidOrder);
    const errors = await validate(orderDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('totalAmount');
  });


  it('should allow an optional user field', async () => {
    const validOrderItem: CreateOrderItemDto = {
        productId: 1,
        quantity: 2,
        price: 20.50,
        orderId: 0
    };

    const user = new User();
    user.id = 1;
    user.username = 'Admin User';

    const validOrder = {
      customerName: 'John Doe',
      shippingAddress: '1234 Main St',
      totalAmount: 50.75,
      items: [validOrderItem],
      user: user
    };

    const orderDto = plainToInstance(CreateOrderDto, validOrder);
    const errors = await validate(orderDto);

    expect(errors.length).toBe(0);
    expect(orderDto.user?.username).toBe('Admin User');
  });
});
