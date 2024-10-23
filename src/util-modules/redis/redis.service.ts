import { Inject, Injectable } from '@nestjs/common';
import {
  MODULE_OPTIONS_TOKEN,
  RedisModuleOptions,
} from './redis.module-definition';
import { createClient, RedisClientType, SetOptions } from 'redis';

@Injectable()
export class RedisService {
  private client: RedisClientType;
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private options: RedisModuleOptions,
  ) {
    this.initRedis(options);
  }

  private async initRedis(options) {
    this.client = createClient({
      socket: {
        ...options,
      },
    });
    await this.client.connect();
  }

  /**
   * 设置带有过期时间的值
   * @param key 键
   * @param value 值
   * @param expire 过期时间（单位：秒）
   */
  async setWithExpire(key: string, value: string, expire: number) {
    await this.set(key, value, { EX: expire });
  }

  async set(key: string, value: string, config: SetOptions = {}) {
    await this.client.set(key, value, config);
  }

  async get<T>(key: string): Promise<any> {
    return this.client.get(key) as T;
  }

  async del(key: string) {
    return this.client.del(key);
  }

  /**
   * 获取 redis 实例
   * @returns redis 实例
   */
  getClient() {
    return this.client;
  }
}
