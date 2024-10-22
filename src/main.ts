import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  setupInterceptor,
  setupFilter,
  Configuration,
  setupPipe,
} from './core';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 注册拦截器
  setupInterceptor(app);
  // 注册过滤器
  setupFilter(app);
  // 注册管道
  setupPipe(app);

  const configService = app.get(ConfigService);
  const port = configService.get<Configuration['port']>('port');
  await app.listen(port);
}

bootstrap();
