import { INestApplication, ValidationPipe } from '@nestjs/common';

export function setupPipe(app: INestApplication) {
  // 配置自动验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
    }),
  );
}
