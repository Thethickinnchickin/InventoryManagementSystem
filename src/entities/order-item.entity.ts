import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.items, { eager: true })
  @JoinColumn({ name: 'order_id' })  // Specify the column name
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })  // Specify the column name
  product: Product;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @DeleteDateColumn() // Add this column for soft deletion
  deletedAt?: Date;

}
