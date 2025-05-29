import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../services/product.service';
import { ProductRepository } from '../infrastructure/product.repository';
import { ProductEntity } from '../domain/product.entity';
import { ok, err } from '../../shared/result';

describe('ProductService', () => {
  let service: ProductService;
  let repo: jest.Mocked<ProductRepository>;

  const mockProduct: ProductEntity = {
    id: 'prod-123',
    priceIva: 1234,
    name: 'Test Product',
  } as ProductEntity;

  const mockRepo = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: ProductRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repo = module.get(ProductRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return products in Result.ok', async () => {
      repo.findAll.mockResolvedValue([mockProduct]);

      const result = await service.getAllProducts();

      result.match(
        (value) => {
          expect(value).toEqual([mockProduct]);
        },
        () => fail('Expected Result.ok')
      );

      expect(repo.findAll).toHaveBeenCalled();
    });

    it('should return Result.err on exception', async () => {
      repo.findAll.mockRejectedValue(new Error('DB error'));

      const result = await service.getAllProducts();

      result.match(
        () => fail('Expected Result.err'),
        (error, code) => {
          expect(error).toBe('Ah ocurrido un error al obtener los productos...');
          expect(code).toBe(404);
        }
      );
    });
  });

  describe('getProductById', () => {
    it('should return product in Result.ok', async () => {
      repo.findById.mockResolvedValue(mockProduct);

      const result = await service.getProductById('prod-123');

      result.match(
        (value) => {
          expect(value).toEqual(mockProduct);
        },
        () => fail('Expected Result.ok')
      );

      expect(repo.findById).toHaveBeenCalledWith('prod-123');
    });

    it('should return Result.err on exception', async () => {
      repo.findById.mockRejectedValue(new Error('DB error'));

      const result = await service.getProductById('prod-123');

      result.match(
        () => fail('Expected Result.err'),
        (error, code) => {
          expect(error).toBe('Ah ocurrido un error al obtener los productos...');
          expect(code).toBe(404);
        }
      );
    });
  });

  describe('createProduct', () => {
    it('should return created product in Result.ok', async () => {
      repo.create.mockResolvedValue(ok(mockProduct));

      const result = await service.createProduct({ name: 'Nuevo producto' });

      result.match(
        (value) => {
          expect(value).toEqual(mockProduct);
        },
        () => fail('Expected Result.ok')
      );

      expect(repo.create).toHaveBeenCalledWith({ name: 'Nuevo producto' });
    });

    it('should return Result.err on exception', async () => {
      repo.create.mockRejectedValue(new Error('DB error'));

      const result = await service.createProduct({ name: 'Error producto' });

      result.match(
        () => fail('Expected Result.err'),
        (error, code) => {
          expect(error).toBe('Ah ocurrido un error crear la transacción...');
          expect(code).toBe(404);
        }
      );
    });
  });
});
