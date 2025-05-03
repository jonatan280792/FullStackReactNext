import { Test, TestingModule } from '@nestjs/testing';
import { ResponseInterceptor } from './response.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { ResponseDTO } from '@shared/response.dto';
import { Ok, Err } from '@shared/result';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor<any>;
  let context: ExecutionContext;
  let next: jest.Mocked<CallHandler<any>>;  // Uso de jest.Mocked para mockear correctamente CallHandler

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseInterceptor],
    }).compile();

    interceptor = module.get<ResponseInterceptor<any>>(ResponseInterceptor);
  });

  beforeEach(() => {
    context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue({
        statusCode: 200,
        status: jest.fn(),
      }),
    } as unknown as ExecutionContext;

    // Correcto uso de jest.Mocked para mockear CallHandler
    next = {
      handle: jest.fn(), // mockeamos el handle como función de jest.fn()
    } as jest.Mocked<CallHandler<any>>;  // Asegúrate de usar jest.Mocked aquí
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should transform Ok result', (done) => {
    const okResult = new Ok('success');

    next.handle.mockReturnValue(of(okResult));

    interceptor.intercept(context, next).subscribe((response) => {
      expect(response).toBeInstanceOf(ResponseDTO);
      expect(response.success).toBe(true);
      expect(response.message).toBe('Operación exitosa');
      expect(response.data).toBe('success');
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should transform Err result', (done) => {
    const errResult = new Err('Error occurred', 400);
    
    // Mockeamos 'handle' para devolver un Observable con 'errResult'
    next.handle.mockReturnValue(of(errResult));
  
    interceptor.intercept(context, next).subscribe(
      (response) => {
        try {
          expect(response).toBeInstanceOf(ResponseDTO);
          expect(response.success).toBe(false);
          expect(response.message).toBe('Error occurred');
          expect(response.data).toBeNull();
          expect(response.statusCode).toBe(200);
          done();
        } catch (error) {
          done(error);
        }
      },
      (error) => {
        done(error);
      }
    );
  });

  it('should return direct result', (done) => {
    const directResult = 'direct value';
    
    next.handle.mockReturnValue(of(directResult));

    interceptor.intercept(context, next).subscribe((response) => {
      expect(response).toBeInstanceOf(ResponseDTO);
      expect(response.success).toBe(true);
      expect(response.message).toBe('Operación exitosa');
      expect(response.data).toBe('direct value');
      expect(response.statusCode).toBe(200);
      done();
    });
  });
});
