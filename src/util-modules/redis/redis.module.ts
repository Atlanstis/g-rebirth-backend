import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './redis.module-definition';
import { RedisService } from '.';

@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule extends ConfigurableModuleClass {}
