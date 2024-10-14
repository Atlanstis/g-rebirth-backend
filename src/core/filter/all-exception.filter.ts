import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { ResponseData } from '../classes';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // 捕获代码报错的异常
    if (exception instanceof TypeError) {
      console.error(exception.message);
    } else if (exception instanceof Error) {
      console.error(exception.message);
    }

    const data = ResponseData.error(undefined, '程序开小差了(╥_╥)');

    response.status(HttpStatus.OK).json(data);
  }
}
