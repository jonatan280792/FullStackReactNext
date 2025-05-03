import { Test, TestingModule } from '@nestjs/testing';
import { TransactionModule } from './transaction.module';
import { TransactionService } from './services/transaction.service';
import { JwtService } from '@nestjs/jwt';
import { WompiClient } from './infrastructure/wompi.client';
import { ServiceUtils } from '@utils/rest-utils/http-service.utils';

// Mockear las dependencias
const mockWompiClient = {
  processPayment: jest.fn(),
};

const mockServiceUtils = {
  makeHttpRequest: jest.fn(),
};

process.env.JWT_SECRET = 'mock-secret-key'; // Establecemos un valor para la variable de entorno

describe('TransactionModule', () => {
  let transactionService: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TransactionModule], // Importamos el módulo TransactionModule
      providers: [
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
            verify: jest.fn().mockReturnValue({ userId: 1 }),
          },
        },
        {
          provide: WompiClient,
          useValue: mockWompiClient, // Usamos el mock de WompiClient
        },
        {
          provide: ServiceUtils,
          useValue: mockServiceUtils, // Usamos el mock de ServiceUtils
        },
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService); // Obtenemos la instancia del servicio TransactionService
  });

  it('should be defined', () => {
    expect(transactionService).toBeDefined(); // Verificamos que el servicio esté definido
  });

  // Puedes agregar más tests aquí según los métodos de TransactionService que necesites probar
});
