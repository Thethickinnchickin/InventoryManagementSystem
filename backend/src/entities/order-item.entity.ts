// src/entities/order-item.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

/**
 * Represents an item within an order.
 * Contains information about the product, quantity, and price.
 * Allows for tracking and managing individual items associated with an order.
 */
@Entity('order_items')
export class OrderItem {
  /**
   * Unique identifier for the order item.
   * This is an auto-generated primary key.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Reference to the order that this item belongs to.
   * Defines a many-to-one relationship with the Order entity.
   * Each order item is associated with a single order.
   */
  @ManyToOne(() => Order, order => order.items, { eager: true })
  @JoinColumn({ name: 'order_id' })  // Specify the column name in the database
  order: Order;

  /**
   * Reference to the product being ordered.
   * Defines a many-to-one relationship with the Product entity.
   * Each order item is associated with a single product.
   */
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })  // Specify the column name in the database
  product: Product;

  /**
   * Quantity of the product ordered.
   * Stored as an integer value.
   */
  @Column({ type: 'integer' })
  quantity: number;

  /**
   * Price of the product at the time of ordering.
   * Stored as a decimal with precision 10 and scale 2 to handle monetary values.
   */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  /**
   * Date and time when the item was soft-deleted.
   * This column is used for soft deletion to retain historical data.
   */
  @DeleteDateColumn() // Add this column for soft deletion
  deletedAt?: Date;
}
