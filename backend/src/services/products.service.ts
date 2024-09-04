import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    // Create a new product entity
    const product = this.productsRepository.create(createProductDto);
  
    // Save the new product to the database
    const savedProduct = await this.productsRepository.save(product);
  
    // Log the creation action with the initial state of the product
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
  
    // Update product fields
    await this.productsRepository.update(id, {
      name: updateProductDto.name,
      description: updateProductDto.description,
      price: updateProductDto.price,
      stock: updateProductDto.stock,
    });
  
    // Update categories if provided
    if (updateProductDto.categoryIds && updateProductDto.categoryIds.length > 0) {
      const categories = await this.categoriesRepository.findByIds(updateProductDto.categoryIds);
      existingProduct.categories = categories;
    }
  
    // Save the updated product
    const updatedProduct = await this.productsRepository.save(existingProduct);
  
    // Log the update action
    await this.auditService.logAction(
      'Product',
      id,
      'UPDATE',
      {
        before: existingProduct,
        after: updatedProduct
      }
    );
  
    return updatedProduct;
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

  async updateProductCategories(productId: number, categoryIds: number[]): Promise<Product> {
    const product = await this.findOne(productId);

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    const categories = await this.categoriesRepository.findByIds(categoryIds);
    product.categories = categories;

    return this.productsRepository.save(product);
  }

}
