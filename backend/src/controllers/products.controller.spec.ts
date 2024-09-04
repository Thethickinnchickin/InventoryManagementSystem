import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from '../services/products.service';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Category } from '../entities/category.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../entities/user.entity';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            findCategoriesByProduct: jest.fn(),
            findProductsByCategory: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            updateProductCategories: jest.fn(),
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

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated products list', async () => {
      const result = {
        data: [
          {
            id: 1,
            name: 'Product A',
            description: 'Description for Product A',
            price: 100,
            stock: 50,
            categories: [], // Adjust this to match the actual structure
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        total: 1,
        page: 1,
        lastPage: 1,
      };
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll(1, 10, true)).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const result: Product = {
        id: 1,
        name: 'Product A',
        description: 'Description for Product A',
        price: 100,
        stock: 50,
        categories: [], // Adjust this to match the actual structure
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(1)).toBe(result);
    });
  });

  describe('getCategoriesByProduct', () => {
    it('should return categories for a product', async () => {
      const result: Category[] = [
        {
          id: 1,
          name: 'Category A',
          products: [], // Adjust this to match the actual structure
        },
      ];
      jest.spyOn(service, 'findCategoriesByProduct').mockResolvedValue(result);

      expect(await controller.getCategoriesByProduct(1)).toBe(result);
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products for a category', async () => {
      const result: Product[] = [
        {
          id: 1,
          name: 'Product A',
          description: 'Description for Product A',
          price: 100,
          stock: 50,
          categories: [], // Adjust this to match the actual structure
        },
      ];
      jest.spyOn(service, 'findProductsByCategory').mockResolvedValue(result);

      expect(await controller.getProductsByCategory('Category A')).toBe(result);
    });
  });

  describe('create', () => {
    it('should create and return a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product A',
        description: 'Description for Product A',
        price: 100,
        stock: 50,
      };
      const result: Product = {
        id: 1,
        name: 'Product A',
        description: 'Description for Product A',
        price: 100,
        stock: 50,
        categories: [], // Adjust this to match the actual structure
      };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createProductDto)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update and return the updated product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product A',
        description: 'Updated description for Product A',
        price: 150,
        stock: 30,
      };
      const result: Product = {
        id: 1,
        name: 'Updated Product A',
        description: 'Updated description for Product A',
        price: 150,
        stock: 30,
        categories: [], // Adjust this to match the actual structure
      };
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(1, updateProductDto)).toBe(result);
    });
  });

  describe('updateCategories', () => {
    it('should update product categories and return the updated product', async () => {
      const categoryIds = [1, 2];
      const result: Product = {
        id: 1,
        name: 'Product A',
        description: 'Description for Product A',
        price: 100,
        stock: 50,
        categories: [], // Adjust this to match the actual structure
      };
      jest.spyOn(service, 'updateProductCategories').mockResolvedValue(result);

      expect(await controller.updateCategories(1, categoryIds)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove the product', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue();

      expect(await controller.remove(1)).toBeUndefined();
    });
  });
});
