import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '../services/transaction.service';
import { WompiClient } from '../infrastructure/wompi.client';
import { CreateTransactionDto, PaymentMethodType } from '../dto/create-transaction.dto';
import { Result, ok, err } from '@shared/result';
import { JwtService } from '@nestjs/jwt';

// Mock de process.env
process.env.INTEGRITY_SECRET = 'test_secret';

// 🧪 Mock del cliente de Wompi
const mockWompiClient = {
  getMerchantInfo: jest.fn(),
  createTransaction: jest.fn(),
};

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        TransactionService,
        { provide: WompiClient, useValue: mockWompiClient },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should return ok when transaction is created successfully', async () => {
      const dto: CreateTransactionDto = {
        amount_in_cents: 1000,
        currency: 'COP',
        customer_email: 'test@example.com',
        payment_method: {
          type: PaymentMethodType.NEQUI,
          phone_number: '3191111111',
          payment_description: 'Test payment',
        },
        reference: 'ref-123',
      };

      const merchantResponse = {
        data: {
          presigned_acceptance: {
            acceptance_token: 'token-123',
          },
        },
      };

      const transactionResponse = {
        data: { status: 'APPROVED', id: 'trx-001' },
      };

      mockWompiClient.getMerchantInfo.mockResolvedValue(merchantResponse);
      mockWompiClient.createTransaction.mockResolvedValue(transactionResponse);

      const result = await service.create({ ...dto });

      result.match(
        (value) => {
          expect(value).toEqual(transactionResponse);
        },
        () => fail('Expected Result.ok but got Result.err')
      );

      expect(mockWompiClient.getMerchantInfo).toHaveBeenCalled();
      expect(mockWompiClient.createTransaction).toHaveBeenCalledWith(expect.objectContaining({
        acceptance_token: 'token-123',
        signature: expect.any(String),
      }));
    });

    it('should return err if merchant response is invalid', async () => {
      mockWompiClient.getMerchantInfo.mockResolvedValue({}); // Sin data válida

      const dto = {
        amount_in_cents: 1000,
        currency: 'COP',
        customer_email: 'test@example.com',
        payment_method: {
          type: PaymentMethodType.NEQUI,
          phone_number: '3191111111',
          payment_description: 'Test payment',
        },
        reference: 'ref-123',
      };

      const result = await service.create({ ...dto });

      result.match(
        () => fail('Expected Result.err'),
        (error) => {
          expect(error).toBe('No se pudo obtener el token de aceptación del merchant');
        }
      );

      expect(mockWompiClient.getMerchantInfo).toHaveBeenCalled();
      expect(mockWompiClient.createTransaction).not.toHaveBeenCalled();
    });

    it('should return err when createTransaction throws an error', async () => {
      const dto = {
        amount_in_cents: 1000,
        currency: 'COP',
        customer_email: 'test@example.com',
        payment_method: {
          type: PaymentMethodType.NEQUI,
          phone_number: '3191111111',
          payment_description: 'Test payment',
        },
        reference: 'ref-123',
      };

      const merchantResponse = {
        data: {
          presigned_acceptance: {
            acceptance_token: 'token-123',
          },
        },
      };

      mockWompiClient.getMerchantInfo.mockResolvedValue(merchantResponse);
      mockWompiClient.createTransaction.mockRejectedValue(new Error('Network error'));

      const result = await service.create({ ...dto });

      result.match(
        () => fail('Expected Result.err'),
        (error) => {
          expect(error).toBe('Error al crear la transacción: Network error');
        }
      );

      expect(mockWompiClient.createTransaction).toHaveBeenCalled();
    });
  });
});
