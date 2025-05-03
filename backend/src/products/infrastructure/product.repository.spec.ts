import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from './product.repository';
import { ProductEntity } from '../domain/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ProductRepository', () => {
  let repository: ProductRepository;
  let repoMock: jest.Mocked<Repository<ProductEntity>>;

  const mockProduct: ProductEntity = {
    id: 'prod-1',
    name: 'Test Product',
  } as ProductEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepository,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<ProductRepository>(ProductRepository);
    repoMock = module.get(getRepositoryToken(ProductEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return product wrapped in ok', async () => {
      const inputData = { name: 'New Product' };

      const mockCreated = { ...mockProduct, ...inputData };

      repoMock.create.mockReturnValue(mockCreated);
      repoMock.save.mockResolvedValue(mockCreated);

      const result = await repository.create(inputData);

      result.match(
        (value) => {
          expect(value).toEqual(mockCreated);
        },
        () => fail('Expected Result.ok')
      );

      expect(repoMock.create).toHaveBeenCalledWith(inputData);
      expect(repoMock.save).toHaveBeenCalledWith(mockCreated);
    });

    it('should return err if saving throws error', async () => {
      const inputData = { name: 'Fail Product' };
      const mockCreated = { ...mockProduct, ...inputData };

      repoMock.create.mockReturnValue(mockCreated);
      repoMock.save.mockRejectedValue(new Error('DB error'));

      const result = await repository.create(inputData);

      result.match(
        () => fail('Expected Result.err'),
        (error) => {
          expect(error).toContain('Error creating product: DB error');
        }
      );

      expect(repoMock.create).toHaveBeenCalled();
      expect(repoMock.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [mockProduct];
      repoMock.find.mockResolvedValue(products);

      const result = await repository.findAll();

      expect(result).toEqual(products);
      expect(repoMock.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return product by ID', async () => {
      repoMock.findOneBy.mockResolvedValue(mockProduct);

      const result = await repository.findById('prod-1');

      expect(result).toEqual(mockProduct);
      expect(repoMock.findOneBy).toHaveBeenCalledWith({ id: 'prod-1' });
    });

    it('should return null if product not found', async () => {
      repoMock.findOneBy.mockResolvedValue(null);

      const result = await repository.findById('invalid-id');

      expect(result).toBeNull();
      expect(repoMock.findOneBy).toHaveBeenCalledWith({ id: 'invalid-id' });
    });
  });
});
