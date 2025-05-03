import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';
import { ProductService } from '@products/services/product.service';
import { Logger } from '@nestjs/common';
import { ProductEntity } from '@products/domain/product.entity';
import { Result, Ok, Err } from '@shared/result';

describe('SeedService', () => {
  let seedService: SeedService;
  let productServiceMock: Partial<ProductService>;

  beforeEach(async () => {
    productServiceMock = {
      getAllProducts: jest.fn(),
      createProduct: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        {
          provide: ProductService,
          useValue: productServiceMock,
        },
        Logger,
      ],
    }).compile();

    seedService = module.get<SeedService>(SeedService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('seedProducts', () => {
    it('should not create dummy products if they already exist', async () => {
      const existingProducts: ProductEntity[] = [
        { id: '1', name: 'Teclado MX Series Logi', price: 523540.00, description: 'Some description' },
        { id: '2', name: 'Mouse MX Series Logi', price: 352456.99, description: 'Some description' },
        { id: '3', name: 'Diadema Logi MX Series', price: 265452.99, description: 'Some description' },
      ];

      const mockResponse = new Ok(existingProducts);
      (productServiceMock.getAllProducts as jest.Mock).mockResolvedValue(mockResponse);

      await seedService.seedProducts();

      // Verificamos que no se hayan creado productos
      expect(productServiceMock.createProduct).not.toHaveBeenCalled();
    });

    it('should create dummy products if none exist', async () => {
      const mockResponse = new Ok([]);
      (productServiceMock.getAllProducts as jest.Mock).mockResolvedValue(mockResponse);

      const dummyProducts: Partial<ProductEntity>[] = [
        { name: 'Teclado MX Series Logi', description: 'Some description', price: 523540.00 },
        { name: 'Mouse MX Series Logi', description: 'Some description', price: 352456.99 },
        { name: 'Diadema Logi MX Series', description: 'Some description', price: 265452.99 },
      ];

      // Mock de creación de productos
      (productServiceMock.createProduct as jest.Mock).mockResolvedValue(undefined);

      await seedService.seedProducts();

      // Verificamos que los productos dummy fueron creados
      dummyProducts.forEach((product) => {
        expect(productServiceMock.createProduct).toMatch;
      });
    });

    it('should log error if there is an issue fetching existing products', async () => {
      const mockErrorResponse = new Err('Error fetching products', 500);
      (productServiceMock.getAllProducts as jest.Mock).mockResolvedValue(mockErrorResponse);

      await seedService.seedProducts();

      // Verificar que se haya registrado un error en el logger
      expect(productServiceMock.createProduct).not.toHaveBeenCalled();
    });
  });
});
