import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Category } from '../entities/category.entity';
import { AuditService } from './audit.service';



@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,

    private readonly auditService: AuditService, // Inject the AuditService
  ) {}

  async findAll({ page = 1, limit = 10, isPaginated = false }): Promise<{ data: Product[]; total: number; page: number; lastPage: number }> {
    if(isPaginated) {
      const [data, total] = await this.productsRepository.findAndCount({
        take: limit,
        skip: (page - 1) * limit,
      });

      return {
        data,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } else {
      const [data, total] = await this.productsRepository.findAndCount();
      return {
        data,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    }
  }

  findOne(id: number): Promise<Product> {
    return this.productsRepository.findOne({
      where: { id },
      relations: ['categories'], // Ensure categories are loaded
    });
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Create a new product entity from the DTO (excluding categories for now)
    const product = this.productsRepository.create({
      name: createProductDto.name,
      description: createProductDto.description,
      price: createProductDto.price,
      stock: createProductDto.stock,
    });
  
    // Find the categories based on categoryIds using findBy and In
    if (createProductDto.categoryIds && createProductDto.categoryIds.length > 0) {
      const categories = await this.categoriesRepository.find({
        where: {
          id: In(createProductDto.categoryIds),
        },
      });
      product.categories = categories;
    }
    // Save the product with its categories
    const savedProduct = await this.productsRepository.save(product);
  
    // Log the creation action
    await this.auditService.logAction(
      'Product', // entityName
      savedProduct.id, // entityId
      'CREATE', // action
      { after: savedProduct } // changes
    );
  
    return savedProduct;
  }
  
  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const existingProduct = await this.findOne(id);
    if (!existingProduct) {
      throw new Error(`Product with ID ${id} not found`);
    }
  
    // Preserve existing values if not provided in updateProductDto
    const updatedProduct = {
      ...existingProduct,
      name: updateProductDto.name ?? existingProduct.name,
      description: updateProductDto.description ?? existingProduct.description,
      price: updateProductDto.price ?? existingProduct.price,
      stock: updateProductDto.stock ?? existingProduct.stock,
    };
  
    // Update categories if provided
    if (updateProductDto.categoryIds && updateProductDto.categoryIds.length > 0) {
      const categories = await this.categoriesRepository.findByIds(updateProductDto.categoryIds);
      updatedProduct.categories = categories;
    }
  
    // Save the updated product
    const savedProduct = await this.productsRepository.save(updatedProduct);
  
    // Log the update action
    await this.auditService.logAction(
      'Product',
      id,
      'UPDATE',
      {
        before: existingProduct,
        after: savedProduct
      }
    );
  
    return savedProduct;
  }
  
  
  async remove(id: number): Promise<void> {
    // Fetch the product before deletion for audit purposes
    const existingProduct = await this.findOne(id);
    if (!existingProduct) {
      throw new Error(`Product with ID ${id} not found`);
    }

    await this.productsRepository.delete(id);

    // Log the deletion action
    await this.auditService.logAction(
      'Product',  // entityName
      id,         // entityId
      'DELETE',   // action
      { before: existingProduct }
    );
  }


  async findProductsByCategory(categoryName: string): Promise<Product[]> {
    return this.productsRepository
      .createQueryBuilder('product')
      .innerJoin('product.categories', 'category')
      .where('category.name = :categoryName', { categoryName })
      .getMany();
  }

  async findCategoriesByProduct(productId: number): Promise<Category[]> {
    return this.categoriesRepository
      .createQueryBuilder('category')
      .innerJoin('category.products', 'product')
      .where('product.id = :productId', { productId })
      .getMany();
  }

  async updateProductCategories(id: number, categoryIds: number[]): Promise<Product> {
    const existingProduct = await this.findOne(id);
    if (!existingProduct) {
      throw new Error(`Product with ID ${id} not found`);
    }
  
    // Store the current categories for audit logging
    const beforeCategories = existingProduct.categories;
  
    // Find new categories
    const newCategories = await this.categoriesRepository.findByIds(categoryIds);
    existingProduct.categories = newCategories;
  
    // Save updated product
    const updatedProduct = await this.productsRepository.save(existingProduct);
  
    // Log the action
    await this.auditService.logAction(
      'Product',
      id,
      'UPDATE_CATEGORIES',
      {
        before: beforeCategories,
        after: newCategories,
      }
    );
  
    return updatedProduct;
  }
  
}
