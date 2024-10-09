import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { IS_RAW_DATA, ResponseData } from 'src/core';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isRawData = this.reflector.getAllAndOverride<boolean>(IS_RAW_DATA, [
      context.getHandler(),
      context.getClass(),
    ]);
    return next.handle().pipe(
      map((data) => {
        return isRawData ? data : ResponseData.success(data);
      }),
    );
  }
}
