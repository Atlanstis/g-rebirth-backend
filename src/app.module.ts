import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { yamlConfiguration, validateEnvironment, ormConfig } from './core';
import { UserModule, AuthModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      /** 全局注册配置模块 */
      isGlobal: true,
      /** 忽略默认的配置文件 */
      ignoreEnvFile: true,
      /** 自定义加载配置文件 */
      load: [yamlConfiguration],
      /** 验证环境参数 */
      validate: validateEnvironment,
    }),
    TypeOrmModule.forRoot(ormConfig),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
