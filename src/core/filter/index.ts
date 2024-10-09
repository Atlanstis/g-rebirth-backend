import { type INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { AllExceptionsFilter } from './all-exception.filter';

export function setupFilter(app: INestApplication) {
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());
}
