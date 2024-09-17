import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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

    private readonly auditService: AuditService, // Inject AuditService for logging actions
  ) {}

  /**
   * Retrieve a paginated list of products or all products based on `isPaginated` flag.
   * @param page - Current page number (1-based).
   * @param limit - Number of products per page.
   * @param isPaginated - Flag to determine if pagination should be applied.
   * @returns An object containing product data, total count, current page, and last page.
   */
  async findAll({ page = 1, limit = 10, isPaginated = false }): Promise<{ data: Product[]; total: number; page: number; lastPage: number }> {
    const queryOptions: any = {
      take: limit,
      skip: (page - 1) * limit,
    };

    // Adjust query options based on pagination flag
    if (!isPaginated) {
      delete queryOptions.take;
      delete queryOptions.skip;
    }

    const [data, total] = await this.productsRepository.findAndCount(queryOptions);

    return {
      data,
      total,
      page,
      lastPage: isPaginated ? Math.ceil(total / limit) : 1, // Calculate last page if paginated
    };
  }

  /**
   * Retrieve a single product by its ID.
   * @param id - The ID of the product to retrieve.
   * @returns The product entity.
   * @throws NotFoundException if the product does not exist.
   */
  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['categories'], // Load related categories for the product
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  /**
   * Create a new product with optional categories.
   * @param createProductDto - Data transfer object containing product details.
   * @returns The created product entity.
   * @throws InternalServerErrorException if creation fails.
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create({
      name: createProductDto.name,
      description: createProductDto.description,
      price: createProductDto.price,
      stock: createProductDto.stock,
    });
  
    // Associate categories with the product if categoryIds are provided
    if (createProductDto.categoryIds && createProductDto.categoryIds.length > 0) {
      const categories = await this.categoriesRepository.find({
        where: {
          id: In(createProductDto.categoryIds),
        },
      });
      product.categories = categories;
    }
  
    try {
      const savedProduct = await this.productsRepository.save(product);
      await this.auditService.logAction('Product', savedProduct.id, 'CREATE', { after: savedProduct });
      return savedProduct;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create product');
    }
  }
  
  /**
   * Update an existing product by its ID.
   * @param id - The ID of the product to update.
   * @param updateProductDto - Data transfer object containing updated product details.
   * @returns The updated product entity.
   * @throws NotFoundException if the product does not exist.
   * @throws InternalServerErrorException if update fails.
   */
  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const existingProduct = await this.findOne(id);

    // Preserve existing values if not provided in the DTO
    const updatedProduct = {
      ...existingProduct,
      name: updateProductDto.name ?? existingProduct.name,
      description: updateProductDto.description ?? existingProduct.description,
      price: updateProductDto.price ?? existingProduct.price,
      stock: updateProductDto.stock ?? existingProduct.stock,
    };
  
    // Update categories if provided in the DTO
    if (updateProductDto.categoryIds && updateProductDto.categoryIds.length > 0) {
      const categories = await this.categoriesRepository.findByIds(updateProductDto.categoryIds);
      updatedProduct.categories = categories;
    }
  
    try {
      const savedProduct = await this.productsRepository.save(updatedProduct);
      await this.auditService.logAction('Product', id, 'UPDATE', {
        before: existingProduct,
        after: savedProduct,
      });
      return savedProduct;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update product');
    }
  }
  
  /**
   * Remove a product by its ID.
   * @param id - The ID of the product to remove.
   * @throws NotFoundException if the product does not exist.
   * @throws InternalServerErrorException if deletion fails.
   */
  async remove(id: number): Promise<void> {
    const existingProduct = await this.findOne(id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    try {
      await this.productsRepository.delete(id);
      await this.auditService.logAction('Product', id, 'DELETE', { before: existingProduct });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete product');
    }
  }

  /**
   * Find products that belong to a specific category by name.
   * @param categoryName - The name of the category.
   * @returns An array of products that belong to the specified category.
   */
  async findProductsByCategory(categoryName: string): Promise<Product[]> {
    return this.productsRepository
      .createQueryBuilder('product')
      .innerJoin('product.categories', 'category')
      .where('category.name = :categoryName', { categoryName })
      .getMany();
  }

  /**
   * Find categories that a specific product belongs to.
   * @param productId - The ID of the product.
   * @returns An array of categories that the product belongs to.
   */
  async findCategoriesByProduct(productId: number): Promise<Category[]> {
    return this.categoriesRepository
      .createQueryBuilder('category')
      .innerJoin('category.products', 'product')
      .where('product.id = :productId', { productId })
      .getMany();
  }

  /**
   * Update categories for a specific product.
   * @param id - The ID of the product to update.
   * @param categoryIds - Array of category IDs to associate with the product.
   * @returns The updated product entity.
   * @throws NotFoundException if the product does not exist.
   * @throws InternalServerErrorException if update fails.
   */
  async updateProductCategories(id: number, categoryIds: number[]): Promise<Product> {
    const existingProduct = await this.findOne(id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  
    const beforeCategories = existingProduct.categories;
    const newCategories = await this.categoriesRepository.findByIds(categoryIds);
    existingProduct.categories = newCategories;
  
    try {
      const updatedProduct = await this.productsRepository.save(existingProduct);
      await this.auditService.logAction('Product', id, 'UPDATE_CATEGORIES', {
        before: beforeCategories,
        after: newCategories,
      });
      return updatedProduct;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update product categories');
    }
  }
}
