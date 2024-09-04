import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({})
    .overrideGuard(RolesGuard)
    .useValue({})
    .compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result: Category[] = [{
        id: 1, name: 'Test Category',
        products: []
      }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single category', async () => {
      const result: Category = {
        id: 1, name: 'Test Category',
        products: []
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(1)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create and return a new category', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'New Category' };
      const result: Category = {
        id: 1, name: 'New Category',
        products: []
      };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createCategoryDto)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update and return the updated category', async () => {
      const updateCategoryDto: UpdateCategoryDto = { name: 'Updated Category' };
      const result: Category = {
        id: 1, name: 'Updated Category',
        products: []
      };
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(1, updateCategoryDto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove the category', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue();

      expect(await controller.remove(1)).toBeUndefined();
    });
  });
});
