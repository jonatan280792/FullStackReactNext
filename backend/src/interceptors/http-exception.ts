import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseDTO } from '../shared/response.dto';

interface HttpExceptionResponse {
  message: string;
  error?: any;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    // Si la excepción tiene una respuesta personalizada, la obtenemos
    const responseBody = exception.getResponse();
    
    // Comprobar si el responseBody es una cadena o un objeto, y asegurarse de que tenga 'message'
    const message = typeof responseBody === 'string'
      ? responseBody
      : (responseBody as HttpExceptionResponse)?.message || 'Error inesperado';

    // Creamos un ResponseDTO con el error y el status
    const errorResponse = new ResponseDTO(null, message, false);
    errorResponse['statusCode'] = status; // Agregamos el statusCode

    response.status(status).json(errorResponse);
  }
}
