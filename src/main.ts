import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupInterceptor, setupFilter } from './core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 注册拦截器
  setupInterceptor(app);

  // 注册过滤器
  setupFilter(app);

  await app.listen(3000);
}

bootstrap();
