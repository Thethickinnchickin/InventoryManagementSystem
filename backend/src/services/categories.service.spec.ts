// src/categories/categories.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { AuditService } from './audit.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Repository<Category>;
  let auditService: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: AuditService,
          useValue: {
            logAction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
    auditService = module.get<AuditService>(AuditService);
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result = [{ id: 1, name: 'Category1' }] as Category[];
      jest.spyOn(repository, 'find').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single category by id', async () => {
      const result = { id: 1, name: 'Category1' } as Category;
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(result);

      expect(await service.findOne(1)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create and return a new category and log the action', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'NewCategory' };
      const savedCategory = { id: 1, ...createCategoryDto } as Category;
      jest.spyOn(repository, 'create').mockReturnValue(savedCategory);
      jest.spyOn(repository, 'save').mockResolvedValue(savedCategory);

      await service.create(createCategoryDto);

      expect(repository.create).toHaveBeenCalledWith(createCategoryDto);
      expect(repository.save).toHaveBeenCalledWith(savedCategory);
      expect(auditService.logAction).toHaveBeenCalledWith(
        'Category',
        savedCategory.id,
        'CREATE',
        createCategoryDto
      );
    });
  });

  describe('update', () => {
    it('should update and return the category and log the action', async () => {
      const updateCategoryDto: UpdateCategoryDto = { name: 'UpdatedCategory' };
      const updatedCategory = { id: 1, ...updateCategoryDto } as Category;
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(updatedCategory);

      await service.update(1, updateCategoryDto);

      expect(repository.update).toHaveBeenCalledWith(1, updateCategoryDto);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(auditService.logAction).toHaveBeenCalledWith(
        'Category',
        1,
        'UPDATE',
        updateCategoryDto
      );
    });
  });

  describe('remove', () => {
    it('should delete the category and log the action', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

      await service.remove(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(auditService.logAction).toHaveBeenCalledWith(
        'Category',
        1,
        'DELETE',
        {}
      );
    });
  });
});
