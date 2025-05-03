import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from '../services/product.service';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ok, err } from '@shared/result';
import { ProductEntity } from '../domain/product.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
class MockJwtAuthGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
    return true;
  }
}

const mockProductService = {
  getAllProducts: jest.fn(),
  getProductById: jest.fn(),
};

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        JwtService,
        { provide: ProductService, useValue: mockProductService },
      ],
    })
      .overrideProvider(JwtAuthGuard)
      .useClass(MockJwtAuthGuard)
      .compile();

    controller = module.get<ProductController>(ProductController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return Result.ok with products', async () => {
      const products: ProductEntity[] = [
        { id: '1', name: 'Product A' } as ProductEntity,
        { id: '2', name: 'Product B' } as ProductEntity,
      ];

      mockProductService.getAllProducts.mockResolvedValue(ok(products));

      const result = await controller.getAll();

      result.match(
        (val) => expect(val).toEqual(products),
        () => fail('Expected Result.ok but got Result.err')
      );
    });

    it('should return Result.err on service failure', async () => {
      mockProductService.getAllProducts.mockResolvedValue(err('Database error'));

      const result = await controller.getAll();

      result.match(
        () => fail('Expected Result.err but got Result.ok'),
        (error, statusCode) => {
          expect(error).toBe('Database error');
          expect(statusCode).toBe(400);
        }
      );
    });
  });

  describe('getProductById', () => {
    it('should return Result.ok with a product', async () => {
      const product: ProductEntity = { id: '123', name: 'Product X' } as ProductEntity;

      mockProductService.getProductById.mockResolvedValue(ok(product));

      const result = await controller.getProductById('123');

      result.match(
        (val) => expect(val).toEqual(product),
        () => fail('Expected Result.ok but got Result.err')
      );
    });

    it('should return Result.err if product not found', async () => {
      mockProductService.getProductById.mockResolvedValue(err('Product not found', 404));

      const result = await controller.getProductById('999');

      result.match(
        () => fail('Expected Result.err but got Result.ok'),
        (error, statusCode) => {
          expect(error).toBe('Product not found');
          expect(statusCode).toBe(404);
        }
      );
    });
  });
});
