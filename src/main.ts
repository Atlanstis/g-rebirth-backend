import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupInterceptor } from './core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 注册拦截器
  setupInterceptor(app);

  await app.listen(3000);
}

bootstrap();
