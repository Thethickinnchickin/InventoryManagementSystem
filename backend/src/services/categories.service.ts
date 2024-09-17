import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { AuditService } from './audit.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    
    private readonly auditService: AuditService, // Inject the AuditService for logging actions
  ) {}

  /**
   * Retrieve all categories.
   * @returns An array of category entities.
   */
  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find(); // Fetch all categories
  }

  /**
   * Retrieve a single category by its ID.
   * @param id - The ID of the category to retrieve.
   * @returns The category entity.
   * @throws NotFoundException if the category does not exist.
   */
  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException('Category not found'); // Throw a specific error if category is not found
    }
    return category;
  }

  /**
   * Create a new category.
   * @param createCategoryDto - Data transfer object containing category details.
   * @returns The created category entity.
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto); // Create category entity
    const savedCategory = await this.categoriesRepository.save(category); // Save category entity

    // Log the creation action
    await this.auditService.logAction(
      'Category',
      savedCategory.id,
      'CREATE',
      createCategoryDto
    );

    return savedCategory;
  }

  /**
   * Update an existing category by its ID.
   * @param id - The ID of the category to update.
   * @param updateCategoryDto - Data transfer object containing updated category details.
   * @returns The updated category entity.
   * @throws NotFoundException if the category does not exist.
   */
  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id); // Find the category first
    if (!category) {
      throw new NotFoundException('Category not found'); // Use NotFoundException for better error handling
    }

    // Proceed with the update
    await this.categoriesRepository.update(id, updateCategoryDto);
    const updatedCategory = await this.findOne(id); // Fetch the updated category

    // Log the update action
    await this.auditService.logAction(
      'Category',
      id,
      'UPDATE',
      updateCategoryDto
    );

    return updatedCategory;
  }
  
  /**
   * Remove a category by its ID.
   * @param id - The ID of the category to remove.
   * @throws NotFoundException if the category does not exist.
   */
  async remove(id: number): Promise<void> {
    const result = await this.categoriesRepository.delete(id); // Delete the category
    if (result.affected === 0) {
      throw new NotFoundException('Category not found'); // Handle case where delete doesn't affect any rows
    }

    // Log the deletion action
    await this.auditService.logAction(
      'Category',
      id,
      'DELETE',
      {}
    );
  }
}
