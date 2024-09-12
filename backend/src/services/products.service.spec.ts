import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { AuditService } from '../services/audit.service';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { CreateProductDto } from '../dtos/create-product.dto';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productsRepository: Repository<Product>;
  let categoriesRepository: Repository<Category>;
  let auditService: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
        {
          provide: AuditService,
          useValue: {
            logAction: jest.fn(),
          },
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    productsRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    categoriesRepository = module.get<Repository<Category>>(getRepositoryToken(Category));
    auditService = module.get<AuditService>(AuditService);

    jest.spyOn(productsRepository, 'find').mockResolvedValue([
      {
        id: 1,
        name: 'Mock Product 1',
        description: 'Mock Description 1',
        price: 100,
        stock: 10,
        categories: [],
      } as Product,
      {
        id: 2,
        name: 'Mock Product 2',
        description: 'Mock Description 2',
        price: 200,
        stock: 20,
        categories: [],
      } as Product,
    ]);

    jest.spyOn(productsRepository, 'update').mockResolvedValue({
      affected: 1,
      raw: {},
      generatedMaps: [],
    });

    jest.spyOn(categoriesRepository, 'findByIds').mockResolvedValue([
      {
        id: 1,
        name: 'Category 1',
        products: [],
      } as Category,
      {
        id: 2,
        name: 'Category 2',
        products: [],
      } as Category,
    ]);
  });

  describe('create', () => {
    it('should create a new product and return it', async () => {
      const createProductDto = {
        name: 'Product 1',
        description: 'Description',
        price: 100,
        stock: 10,
        categoryIds: [1],
      };
      const mockProduct = { id: 1, ...createProductDto } as unknown as Product;
  
      jest.spyOn(productsRepository, 'create').mockReturnValue(mockProduct);
      jest.spyOn(productsRepository, 'save').mockResolvedValue(mockProduct);
      jest.spyOn(categoriesRepository, 'find').mockResolvedValue([
        {
          id: 1,
          name: 'Category 1',
          products: [],
        },
      ]);
  
      const result = await productsService.create(createProductDto);
  
      expect(result).toEqual(mockProduct);
      expect(productsRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        stock: createProductDto.stock,
      }));
      expect(productsRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        id: 1,
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        stock: createProductDto.stock,
        categories: expect.any(Array),
      }));
      expect(auditService.logAction).toHaveBeenCalledWith('Product', mockProduct.id, 'CREATE', { after: mockProduct });
    });
  });
  

  describe('update', () => {
    it('should update an existing product and return it', async () => {
      const productId = 1;
      const updateProductDto = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 150,
        stock: 20,
      };
      const existingProduct = { id: productId, name: 'Old Product' } as Product;
      const updatedProduct = { id: productId, ...updateProductDto } as unknown as Product;
  
      jest.spyOn(productsService, 'findOne').mockResolvedValue(existingProduct);
      jest.spyOn(categoriesRepository, 'find').mockResolvedValue([
        { id: 1, name: 'Category 1' } as Category,
      ]);
      jest.spyOn(productsRepository, 'save').mockResolvedValue(updatedProduct);
  
      const result = await productsService.update(productId, updateProductDto);
  
      expect(result).toEqual(updatedProduct);
      expect(productsRepository.save).toHaveBeenCalledWith(expect.objectContaining(updatedProduct));
      expect(auditService.logAction).toHaveBeenCalledWith('Product', productId, 'UPDATE', {
        before: existingProduct,
        after: updatedProduct,
      });
    });
  
    it('should throw an error if the product is not found', async () => {
      const productId = 1;
      const updateProductDto = { name: 'Updated Product' };
  
      jest.spyOn(productsService, 'findOne').mockResolvedValue(null);
  
      await expect(productsService.update(productId, updateProductDto)).rejects.toThrow(
        `Product with ID ${productId} not found`
      );
    });
  });
  

  describe('remove', () => {
    it('should remove a product and log the action', async () => {
      const productId = 1;
      const existingProduct: Product = { id: productId, name: 'Product 1', categories: [] } as Product;

      jest.spyOn(productsService, 'findOne').mockResolvedValue(existingProduct);
      jest.spyOn(productsRepository, 'delete').mockResolvedValue(undefined);
      jest.spyOn(auditService, 'logAction').mockResolvedValue(undefined);

      const result = await productsService.remove(productId);

      expect(result).toBeUndefined();
      expect(productsRepository.delete).toHaveBeenCalledWith(productId);
      expect(auditService.logAction).toHaveBeenCalledWith('Product', productId, 'DELETE', { before: existingProduct });
    });

    it('should throw an error if the product is not found', async () => {
      const productId = 1;

      jest.spyOn(productsService, 'findOne').mockResolvedValue(null);

      await expect(productsService.remove(productId)).rejects.toThrow(
        `Product with ID ${productId} not found`
      );
    });
  });

  describe('updateProductCategories', () => {
    it('should update product categories and return the product', async () => {
      const productId = 1;
      const categoryIds = [1, 2]; // Adjusted for the test
      const mockProduct: Product = { id: productId, name: 'Product 1', categories: [] } as Product;
      const mockCategories: Category[] = [
        { id: 1, name: 'Category 1', products: [] },
        { id: 2, name: 'Category 2', products: [] }
      ] as Category[];
  
      // Mock behavior
      jest.spyOn(productsService, 'findOne').mockResolvedValue(mockProduct);
      jest.spyOn(categoriesRepository, 'findByIds').mockResolvedValue(mockCategories); // Ensure correct method
      jest.spyOn(productsRepository, 'save').mockResolvedValue({ ...mockProduct, categories: mockCategories });
      jest.spyOn(auditService, 'logAction').mockResolvedValue(undefined); // Ensure this is correctly mocked
  
      const result = await productsService.updateProductCategories(productId, categoryIds);
  
      expect(result).toEqual({ ...mockProduct, categories: mockCategories });
      expect(productsRepository.save).toHaveBeenCalledWith({ ...mockProduct, categories: mockCategories });
      expect(auditService.logAction).toHaveBeenCalledWith('Product', productId, 'UPDATE_CATEGORIES', {
        before: [], // Categories before the update
        after: mockCategories, // Categories after the update
      });
    });
  
    it('should throw an error if the product is not found', async () => {
      const productId = 1;
      const categoryIds = [1];
  
      jest.spyOn(productsService, 'findOne').mockResolvedValue(null);
  
      await expect(productsService.updateProductCategories(productId, categoryIds)).rejects.toThrow(
        `Product with ID ${productId} not found`
      );
    });
  });
  
  
  
});
