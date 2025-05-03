import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDTO } from '@shared/response.dto';
import { Err, Ok } from '@shared/result';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseDTO<any>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseDTO<any>> {
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((result: T | Ok<T> | Err) => {
        // Si es Ok<T>
        if (result instanceof Ok) {
          return new ResponseDTO(result.value, 'Operación exitosa', true, res.statusCode);
        }

        // Si es Err
        if (result instanceof Err) {
          res.status(result.statusCode); // Cambiar código HTTP real a partir de `Err`
          return new ResponseDTO(null, result.error, false, result.statusCode);
        }

        // Resultado directo sin envoltorio
        return new ResponseDTO(result, 'Operación exitosa', true, res.statusCode);
      }),
    );
  }
}