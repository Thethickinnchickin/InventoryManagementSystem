import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Category } from 'src/entities/category.entity';
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

  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  findOne(id: number): Promise<Product> {
    return this.productsRepository.findOneBy({ id });
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
    // Fetch the product before updating it for audit purposes
    const existingProduct = await this.findOne(id);
    if (!existingProduct) {
      throw new Error(`Product with ID ${id} not found`);
    }

    await this.productsRepository.update(id, updateProductDto);
    const updatedProduct = await this.findOne(id);

    // Log the update action
    await this.auditService.logAction(
      'Product', // entityName
      id,        // entityId
      'UPDATE',  // action
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
}
