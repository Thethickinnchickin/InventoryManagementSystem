import { Entity, Column, PrimaryGeneratedColumn, OneToMany, DeleteDateColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { User } from './user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, default: 'name' })
  customerName: string;

  @Column({ type: 'text', default: 'address' })
  shippingAddress: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  items: OrderItem[];

  @ManyToOne(() => User, user => user.orders)  // Define the relationship
  @JoinColumn({ name: 'user_id' })
  user: User;

  @DeleteDateColumn() // Add this to track soft deletes
  deletedAt: Date | null;

  @CreateDateColumn() // Automatically set to the current date/time when the entity is created
  createdAt: Date;
}
