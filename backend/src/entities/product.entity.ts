// src/entities/product.entity.ts

import { Category } from './category.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

/**
 * Represents a product available in the inventory.
 * Contains details about the product such as name, description, price, and stock.
 * Defines a many-to-many relationship with categories.
 */
@Entity('products')
export class Product {
  /**
   * Unique identifier for the product.
   * This is an auto-generated primary key.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Name of the product.
   * Stored as a varchar with a maximum length of 255 characters.
   */
  @Column({ type: 'varchar', length: 255 })
  name: string;

  /**
   * Description of the product.
   * Stored as a text field to accommodate longer descriptions.
   */
  @Column({ type: 'text' })
  description: string;

  /**
   * Price of the product.
   * Stored as a decimal with precision 10 and scale 2 to handle monetary values.
   */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  /**
   * Stock quantity of the product.
   * Stored as an integer, with a default value of 0.
   */
  @Column({ type: 'int', default: 0 })
  stock: number;

  /**
   * List of categories associated with the product.
   * Defines a many-to-many relationship with the Category entity.
   * A product can belong to multiple categories, and a category can have multiple products.
   */
  @ManyToMany(() => Category, category => category.products)
  @JoinTable({
    name: 'product_categories', // Table name for the junction table
    joinColumn: { name: 'product_id', referencedColumnName: 'id' }, // Column name for the product side
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' }, // Column name for the category side
  })
  categories: Category[];
}
