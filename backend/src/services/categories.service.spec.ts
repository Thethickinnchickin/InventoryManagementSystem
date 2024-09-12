import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { AuditService } from './audit.service';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoriesRepository: Repository<Category>;
  let auditService: AuditService;

  const mockCategory = {
      id: 1,
      name: 'Electronics',
  } as unknown as Category;

  const mockAuditService = {
    logAction: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoriesRepository = module.get<Repository<Category>>(getRepositoryToken(Category));
    auditService = module.get<AuditService>(AuditService);
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      jest.spyOn(categoriesRepository, 'find').mockResolvedValue([mockCategory]);

      const result = await service.findAll();

      expect(result).toEqual([mockCategory]);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      jest.spyOn(categoriesRepository, 'findOneBy').mockResolvedValue(mockCategory);

      const result = await service.findOne(1);

      expect(result).toEqual(mockCategory);
    });

    it('should return undefined if category is not found', async () => {
      jest.spyOn(categoriesRepository, 'findOneBy').mockResolvedValue(undefined);

      const result = await service.findOne(2);

      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create a new category and log the action', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Books',
      };

      jest.spyOn(categoriesRepository, 'create').mockReturnValue(mockCategory);
      jest.spyOn(categoriesRepository, 'save').mockResolvedValue(mockCategory);

      const result = await service.create(createCategoryDto);

      expect(result).toEqual(mockCategory);
      expect(auditService.logAction).toHaveBeenCalledWith('Category', 1, 'CREATE', createCategoryDto);
    });
  });

  describe('update', () => {
    it('should update an existing category and log the action', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Electronics',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockCategory);
      jest.spyOn(categoriesRepository, 'update').mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(categoriesRepository, 'findOneBy').mockResolvedValue(mockCategory);

      const result = await service.update(1, updateCategoryDto);

      expect(result).toEqual(mockCategory);
      expect(auditService.logAction).toHaveBeenCalledWith('Category', 1, 'UPDATE', updateCategoryDto);
    });

    it('should throw an error if the category is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(undefined);

      const updateCategoryDto: UpdateCategoryDto = { name: 'Non-existing Category' };

      await expect(service.update(999, updateCategoryDto)).rejects.toThrowError('Category not found');
    });
  });

  describe('remove', () => {
    it('should remove a category and log the action', async () => {
      jest.spyOn(categoriesRepository, 'delete').mockResolvedValue({ affected: 1 } as any);

      await service.remove(1);

      expect(auditService.logAction).toHaveBeenCalledWith('Category', 1, 'DELETE', {});
    });

    it('should handle the case when trying to remove a non-existent category', async () => {
      jest.spyOn(categoriesRepository, 'delete').mockResolvedValue({ affected: 0 } as any);

      await service.remove(999);

      expect(auditService.logAction).toHaveBeenCalledWith('Category', 999, 'DELETE', {});
    });
  });
});
