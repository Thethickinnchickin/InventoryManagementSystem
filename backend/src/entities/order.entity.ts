// src/entities/order.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, OneToMany, DeleteDateColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { User } from './user.entity';

/**
 * Represents an order placed by a customer.
 * Contains details about the order such as customer name, shipping address, and total amount.
 * Tracks associated order items and the user who placed the order.
 */
@Entity('orders')
export class Order {
  /**
   * Unique identifier for the order.
   * This is an auto-generated primary key.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Name of the customer who placed the order.
   * Stored as a varchar with a maximum length of 255 characters.
   * Default value is 'name'.
   */
  @Column({ type: 'varchar', length: 255, default: 'name' })
  customerName: string;

  /**
   * Shipping address for the order.
   * Stored as a text field.
   * Default value is 'address'.
   */
  @Column({ type: 'text', default: 'address' })
  shippingAddress: string;

  /**
   * Total amount for the order.
   * Stored as a decimal with precision 10 and scale 2 to handle monetary values.
   * Default value is 0.
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  /**
   * List of items included in the order.
   * Defines a one-to-many relationship with the OrderItem entity.
   * Each order can have multiple order items.
   */
  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  items: OrderItem[];

  /**
   * Reference to the user who placed the order.
   * Defines a many-to-one relationship with the User entity.
   * Each order is associated with a single user.
   */
  @ManyToOne(() => User, user => user.orders)  // Define the relationship
  @JoinColumn({ name: 'user_id' })  // Specify the column name in the database
  user: User;

  /**
   * Date and time when the order was soft-deleted.
   * This column is used for soft deletion to retain historical data.
   * Nullable to allow for orders that have not been soft-deleted.
   */
  @DeleteDateColumn() // Add this to track soft deletes
  deletedAt: Date | null;

  /**
   * Date and time when the order was created.
   * Automatically set to the current date/time when the entity is created.
   */
  @CreateDateColumn() // Automatically set to the current date/time when the entity is created
  createdAt: Date;
}
