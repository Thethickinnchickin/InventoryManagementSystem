import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from '../services/products.service';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Category } from '../entities/category.entity';
import { UserRole } from '../entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mock } from 'jest-mock-extended';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    price: 100.00,
    stock: 50,
    description: 'A sample product',
    categories: [],
  };

  const mockCategory: Category = {
    id: 1,
    name: 'Sample Category',
    products: [mockProduct],
  };

  const mockProductsService = {
    findAll: jest.fn().mockResolvedValue({
      data: [mockProduct],
      total: 1,
      page: 1,
      lastPage: 1,
    }),
    findOne: jest.fn().mockResolvedValue(mockProduct),
    findCategoriesByProduct: jest.fn().mockResolvedValue([mockCategory]),
    findProductsByCategory: jest.fn().mockResolvedValue([mockProduct]),
    create: jest.fn().mockResolvedValue(mockProduct),
    update: jest.fn().mockResolvedValue(mockProduct),
    updateProductCategories: jest.fn().mockResolvedValue(mockProduct),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mock(Repository),
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mock(Repository),
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  describe('findAll', () => {
    it('should return a paginated list of products', async () => {
      const result = await controller.findAll(1, 10, true);
      expect(result).toEqual({
        data: [mockProduct],
        total: 1,
        page: 1,
        lastPage: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single product by id', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('getCategoriesByProduct', () => {
    it('should return categories for a given product', async () => {
      const result = await controller.getCategoriesByProduct(1);
      expect(result).toEqual([mockCategory]);
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products for a given category', async () => {
      const result = await controller.getProductsByCategory('Sample Category');
      expect(result).toEqual([mockProduct]);
    });
  });

  describe('create', () => {
    it('should create and return a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'New Product',
        price: 150.00,
        stock: 30,
        description: 'A new product',
      };

      const result = await controller.create(createProductDto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    it('should update and return a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 120.00,
        stock: 25,
        description: 'An updated product',
      };

      const result = await controller.update(1, updateProductDto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('updateCategories', () => {
    it('should update product categories and return the updated product', async () => {
      const categoryIds = [1];
      const result = await controller.updateCategories(1, categoryIds);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('remove', () => {
    it('should remove a product by id', async () => {
      await expect(controller.remove(1)).resolves.toBeUndefined();
    });
  });
});
