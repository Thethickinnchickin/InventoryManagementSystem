// src/orders/dto/update-order.dto.spec.ts
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateOrderDto } from './update-order.dto';
import { OrderItem } from '../entities/order-item.entity';

describe('UpdateOrderDto', () => {
  let dto: UpdateOrderDto;

  beforeEach(() => {
    dto = new UpdateOrderDto();
  });

  it('should succeed with valid data', async () => {
    const validOrderItem = new OrderItem();
    validOrderItem.id = 1; // Assuming OrderItem has an ID or a minimal valid structure

    const validOrder = {
      customerName: 'Jane Doe',
      shippingAddress: '5678 Elm St',
      totalAmount: 100.75,
      items: [validOrderItem],
    };

    const orderDto = plainToInstance(UpdateOrderDto, validOrder);
    const errors = await validate(orderDto);

    expect(errors.length).toBe(0);
  });

  it('should fail if customerName is empty', async () => {
    const validOrderItem = new OrderItem();
    validOrderItem.id = 1;

    const invalidOrder = {
      customerName: '',
      shippingAddress: '5678 Elm St',
      totalAmount: 100.75,
      items: [validOrderItem],
    };

    const orderDto = plainToInstance(UpdateOrderDto, invalidOrder);
    const errors = await validate(orderDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('customerName');
  });

  it('should fail if totalAmount is not a decimal', async () => {
    const validOrderItem = new OrderItem();
    validOrderItem.id = 1;

    const invalidOrder = {
      customerName: 'Jane Doe',
      shippingAddress: '5678 Elm St',
      totalAmount: 'invalid', // Invalid: should be a decimal number
      items: [validOrderItem],
    };

    const orderDto = plainToInstance(UpdateOrderDto, invalidOrder);
    const errors = await validate(orderDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('totalAmount');
  });

  it('should fail if items array is not provided', async () => {
    const invalidOrder = {
      customerName: 'Jane Doe',
      shippingAddress: '5678 Elm St',
      totalAmount: 100.75,
      // items is missing
    };

    const orderDto = plainToInstance(UpdateOrderDto, invalidOrder);
    const errors = await validate(orderDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('items');
  });

  it('should fail if items is not an array', async () => {
    const invalidOrder = {
      customerName: 'Jane Doe',
      shippingAddress: '5678 Elm St',
      totalAmount: 100.75,
      items: {} // Invalid: should be an array
    };

    const orderDto = plainToInstance(UpdateOrderDto, invalidOrder);
    const errors = await validate(orderDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('items');
  });
});
