import { IsEnum } from 'class-validator';

/** mysql 数据库配置 */
export class MysqlConf {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

/** 配置信息 */
export class Configuration {
  mysql: MysqlConf;
  /** 启动端口 */
  port: number;
}

/** 环境枚举 */
export enum Environment {
  /** 开发模式 */
  Development = 'development',
  /** 生产模式 */
  Production = 'production',
}

/** 环境配置 */
export class EnvironmentConf {
  @IsEnum(Environment)
  NODE_ENV: Environment;
}
