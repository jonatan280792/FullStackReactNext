import { Test, TestingModule } from '@nestjs/testing';
import { HttpExceptionFilter } from './http-exception';
import { HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { ResponseDTO } from '../shared/response.dto';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockResponse: Response;
  let mockArgumentsHost: ArgumentsHost;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionFilter],
    }).compile();

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as unknown as ArgumentsHost;
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should handle HttpException with custom message', () => {
    const message = 'Custom error message';
    const exceptionResponse = { message };
    const exception = new HttpException(exceptionResponse, HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Custom error message',
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }),
    );
  });

  it('should handle HttpException with default message when no message is provided', () => {
    const exception = new HttpException('An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'An error occurred',
        data: null,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      }),
    );
  });

  it('should handle HttpException with error object and custom message', () => {
    const exceptionResponse = { message: 'Detailed error', error: 'Validation failed' };
    const exception = new HttpException(exceptionResponse, HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Detailed error',
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }),
    );
  });
});
