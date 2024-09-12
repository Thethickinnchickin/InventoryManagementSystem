import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { mock } from 'jest-mock-extended';
import { ExecutionContext } from '@nestjs/common';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategory: Category = {
    id: 1,
    name: 'Test Category',
  } as Category;

  const mockCategoriesService = mock<CategoriesService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      mockCategoriesService.findAll.mockResolvedValue([mockCategory]);

      const result = await controller.findAll();

      expect(result).toEqual([mockCategory]);
      expect(mockCategoriesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single category', async () => {
      mockCategoriesService.findOne.mockResolvedValue(mockCategory);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockCategory);
      expect(mockCategoriesService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create and return a new category', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'New Category' };
      mockCategoriesService.create.mockResolvedValue(mockCategory);

      const result = await controller.create(createCategoryDto);

      expect(result).toEqual(mockCategory);
      expect(mockCategoriesService.create).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('update', () => {
    it('should update and return the category', async () => {
      const updateCategoryDto: UpdateCategoryDto = { name: 'Updated Category' };
      mockCategoriesService.update.mockResolvedValue(mockCategory);

      const result = await controller.update(1, updateCategoryDto);

      expect(result).toEqual(mockCategory);
      expect(mockCategoriesService.update).toHaveBeenCalledWith(1, updateCategoryDto);
    });

    it('should throw an error if category not found', async () => {
      mockCategoriesService.update.mockRejectedValue(new Error('Category not found'));

      await expect(controller.update(999, { name: 'Non-existing Category' })).rejects.toThrow('Category not found');
    });
  });

  describe('remove', () => {
    it('should remove the category', async () => {
      mockCategoriesService.remove.mockResolvedValue(undefined);

      await expect(controller.remove(1)).resolves.toBeUndefined();
      expect(mockCategoriesService.remove).toHaveBeenCalledWith(1);
    });
  });
});
