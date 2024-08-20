import { Injectable } from '@nestjs/common';
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
    
    private readonly auditService: AuditService, // Inject the AuditService
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  findOne(id: number): Promise<Category> {
    return this.categoriesRepository.findOneBy({ id });
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    const savedCategory = await this.categoriesRepository.save(category);

    // Log the creation action
    await this.auditService.logAction(
      'Category',
      savedCategory.id,
      'CREATE',
      createCategoryDto
    );

    return savedCategory;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    await this.categoriesRepository.update(id, updateCategoryDto);
    const updatedCategory = await this.findOne(id);

    // Log the update action
    await this.auditService.logAction(
      'Category',
      id,
      'UPDATE',
      updateCategoryDto
    );

    return updatedCategory;
  }

  async remove(id: number): Promise<void> {
    await this.categoriesRepository.delete(id);

    // Log the deletion action
    await this.auditService.logAction(
      'Category',
      id,
      'DELETE',
      {}
    );
  }
}

