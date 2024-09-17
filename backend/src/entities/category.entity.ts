// src/entities/category.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Product } from './product.entity';

/**
 * Represents a category for grouping products.
 * Categories help in classifying products into different segments.
 */
@Entity('categories')
export class Category {
  /**
   * Unique identifier for the category.
   * This is an auto-generated primary key.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Name of the category.
   * Stored as a varchar with a maximum length of 255 characters.
   */
  @Column({ type: 'varchar', length: 255 })
  name: string;

  /**
   * List of products associated with this category.
   * Defines a many-to-many relationship with the Product entity.
   * A category can include multiple products, and a product can belong to multiple categories.
   */
  @ManyToMany(() => Product, product => product.categories)
  products: Product[];
}
