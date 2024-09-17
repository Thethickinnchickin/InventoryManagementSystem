// src/entities/user.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './order.entity';

/**
 * Enum representing user roles.
 * Defines the possible roles a user can have.
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

/**
 * Represents a user in the system.
 * Contains details about the user such as username, password, and role.
 * Defines a one-to-many relationship with orders.
 */
@Entity('users')
export class User {
  /**
   * Unique identifier for the user.
   * This is an auto-generated primary key.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Username of the user.
   * Stored as a varchar with a maximum length of 255 characters.
   * Must be unique across the system.
   */
  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  /**
   * Password of the user.
   * Stored as a plain string. Consider hashing passwords before storing them.
   */
  @Column()
  password: string;

  /**
   * Role assigned to the user.
   * Stored as an enum with possible values 'admin' or 'user'.
   * Defaults to 'user'.
   */
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
  
  /**
   * List of orders associated with the user.
   * Defines a one-to-many relationship with the Order entity.
   * A user can have multiple orders.
   */
  @OneToMany(() => Order, order => order.user)  // Define the inverse side
  orders: Order[];
}
