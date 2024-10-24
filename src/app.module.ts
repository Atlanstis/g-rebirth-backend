import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from './core';
import { yamlConfiguration, validateEnvironment, ormConfig } from 'src/config';
import { UserModule, AuthModule, RoleModule, MenuModule } from './modules';
import { RedisModule } from './util-modules';

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
    RedisModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get<Configuration['redis']>('redis');
        return {
          ...redisConfig,
          isGlobal: true,
        };
      },
    }),
    UserModule,
    AuthModule,
    RoleModule,
    MenuModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
