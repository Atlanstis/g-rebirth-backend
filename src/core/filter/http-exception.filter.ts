import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseData } from '../classes';
import { UnauthorizedException } from '../exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = exception.message;

    // ValidationPipe 验证错误，将抛出 BadRequestException 异常
    if (exception instanceof BadRequestException) {
      const response = exception.getResponse() as { message: string[] };
      message = response.message.join('；');
    }

    let data = ResponseData.error(undefined, message);

    // 处理授权认证出错
    if (exception instanceof UnauthorizedException) {
      data = exception.getResponseData();
    }

    response.status(HttpStatus.OK).json(data);
  }
}
