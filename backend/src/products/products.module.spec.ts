import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './services/product.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductEntity } from './domain/product.entity';
import { ProductRepository } from './infrastructure/product.repository';

// Mock de ProductRepository
const mockProductRepository = {
  find: jest.fn(),
  save: jest.fn(),
};

process.env.JWT_SECRET = 'mock-secret-key'; // Establecemos un valor para la variable de entorno

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [], // No importa ProductsModule
      providers: [
        ProductService, // Incluimos directamente el servicio ProductService
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: mockProductRepository, // Usamos el mock de ProductRepository
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
            verify: jest.fn().mockReturnValue({ userId: 1 }),
          },
        },
        {
          provide: ProductRepository, // Aseguramos que ProductRepository esté disponible en el contexto de prueba
          useValue: mockProductRepository, // Usamos el mock de ProductRepository
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService); // Obtenemos la instancia del servicio ProductService
  });

  it('should be defined', () => {
    expect(productService).toBeDefined(); // Verificamos que el servicio esté definido
  });
});
