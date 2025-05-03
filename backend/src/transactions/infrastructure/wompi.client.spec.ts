import { Test, TestingModule } from '@nestjs/testing';
import { WompiClient } from './wompi.client';
import { ServiceUtils } from '@utils/rest-utils/http-service.utils';
import { Err } from '@shared/result';

// Mock de la respuesta de Axios
const mockAxiosResponse = {
  data: {
    presigned_acceptance: { acceptance_token: 'abc123' },
  },
  status: 200,
  statusText: 'OK',
  headers: {},  // Puedes agregar aquí las cabeceras si lo necesitas
  config: {
    url: 'some_url',  // Especifica una URL válida
    method: 'get',    // Método HTTP utilizado
  },
};

describe('WompiClient', () => {
  let wompiClient: WompiClient;
  let serviceUtilsMock: Partial<ServiceUtils>;

  beforeEach(async () => {
    serviceUtilsMock = {
      buildRequest: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WompiClient,
        {
          provide: ServiceUtils,
          useValue: serviceUtilsMock,  // Inyectamos el mock de ServiceUtils
        },
      ],
    }).compile();

    wompiClient = module.get<WompiClient>(WompiClient);
  });

  afterEach(() => {
    jest.clearAllMocks();  // Limpiar mocks después de cada prueba
  });

  describe('getMerchantInfo', () => {
    it('should return merchant data successfully', async () => {
      // Mock de la función buildRequest para simular una respuesta exitosa
      (serviceUtilsMock.buildRequest as jest.Mock).mockResolvedValue(mockAxiosResponse);

      const result = await wompiClient.getMerchantInfo();

      // Verificamos que la respuesta devuelta sea la misma que la mockeada
      expect(result).toEqual(mockAxiosResponse.data);
    });

    it('should return an error if merchant data cannot be fetched', async () => {
      const mockError = {
        response: { data: { error: 'Error no se pudo obtener información' } },
        message: 'Network error', // Podrías simular un error de red si lo deseas
      };
      // Simulamos un error en la llamada a buildRequest
      (serviceUtilsMock.buildRequest as jest.Mock).mockRejectedValue(mockError);

      const result = await wompiClient.getMerchantInfo();

      // Verificamos que el resultado sea una instancia de Err y que el error tenga el mensaje esperado
      expect(result).toBeInstanceOf(Err);
      expect(result).toMatchObject({
        error: 'Error no se pudo obtener información', // Verificamos el mensaje de error
        statusCode: 404,
      });
    });
  });

  describe('createTransaction', () => {
    it('should create a transaction successfully', async () => {
      const transactionData = {
        amount_in_cents: 1000,
        currency: 'COP',
        reference: 'test-ref-123',
      };

      // Simulamos la respuesta de la API para la creación de la transacción
      const mockTransactionResponse = {
        data: {
          status: 'APPROVED',
          transaction_id: 'txn-123',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'some_url',
          method: 'post',
        },
      };

      (serviceUtilsMock.buildRequest as jest.Mock).mockResolvedValue(mockTransactionResponse);

      const result = await wompiClient.createTransaction(transactionData);

      // Verificamos que la transacción devuelta sea la esperada
      expect(result).toEqual(mockTransactionResponse.data);
    });

    it('should return an error if transaction creation fails', async () => {
      const transactionData = {
        amount_in_cents: 1000,
        currency: 'COP',
        reference: 'test-ref-123',
      };

      const mockError = {
        response: { data: { error: 'Error al crear la transacción' } },
        message: 'Network error', // Simulamos un error de red
      };

      // Simulamos un error al crear la transacción
      (serviceUtilsMock.buildRequest as jest.Mock).mockRejectedValue(mockError);

      // Llamamos al método y verificamos que el resultado sea un error
      const result = await wompiClient.createTransaction(transactionData);

      // Verificamos que el resultado sea una instancia de Err y que el error tenga el mensaje esperado
      expect(result).toBeInstanceOf(Err);
      expect(result).toMatchObject({
        error: 'Error al crear la transacción',
        statusCode: 404,
      });
    });
  });
});
