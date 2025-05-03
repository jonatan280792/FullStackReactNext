import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from '../services/transaction.service';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { CreateTransactionDto, PaymentMethodType } from '../dto/create-transaction.dto';
import { Result, Ok, Err } from '@shared/result';

describe('TransactionController', () => {
  let controller: TransactionController;
  let transactionServiceMock: Partial<TransactionService>;

  beforeEach(async () => {
    transactionServiceMock = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: transactionServiceMock,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should return success if transaction is created', async () => {
      const createTransactionDto: CreateTransactionDto = {
        amount_in_cents: 1000,
        currency: 'COP',
        customer_email: 'customer@example.com',
        payment_method: {
          type: PaymentMethodType.NEQUI,
          phone_number: '3001234567',
          payment_description: 'Payment for services',
        },
        reference: 'txn-123',
        acceptance_token: 'abc123',
      };

      const mockResponse = new Ok({
        status: 'APPROVED',
        transactionId: 'txn-id',
      });

      (transactionServiceMock.create as jest.Mock).mockResolvedValue(mockResponse);

      const result = await controller.create(createTransactionDto);

      result.match(
        (value) => {
          expect(value).toEqual({
            status: 'APPROVED',
            transactionId: 'txn-id',
          });
        },
        () => fail('Expected Ok result, but got an Err')
      );
    });

    it('should return error if transaction creation fails', async () => {
      const createTransactionDto: CreateTransactionDto = {
        amount_in_cents: 1000,
        currency: 'COP',
        customer_email: 'customer@example.com',
        payment_method: {
          type: PaymentMethodType.NEQUI,
          phone_number: '3001234567',
          payment_description: 'Payment for services',
        },
        reference: 'txn-123',
        acceptance_token: 'abc123',
      };

      const mockError = new Err('Transaction creation failed', 500);

      (transactionServiceMock.create as jest.Mock).mockResolvedValue(mockError);

      const result = await controller.create(createTransactionDto);

      result.match(
        () => fail('Expected Err result, but got an Ok'),
        (error, statusCode) => {
          expect(error).toBe('Transaction creation failed');
          expect(statusCode).toBe(500);
        }
      );
    });
  });
});
