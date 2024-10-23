import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { Configuration, Environment, EnvironmentConf } from 'src/core';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

/** 读取 yaml 配置文件 */
export function yamlConfiguration() {
  const envConfigFilePath = join(
    process.cwd(),
    `config/${process.env.NODE_ENV || Environment.Development}.yaml`,
  );
  const config = yaml.load(
    readFileSync(envConfigFilePath, 'utf8'),
  ) as Configuration;

  return config;
}

/** 验证环境变量 */
export function validateEnvironment(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentConf, config);

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    stopAtFirstError: true,
  });
  if (errors.length > 0) {
    let errMsg = '';
    errors.forEach((e) => {
      const { constraints } = e;
      Object.keys(constraints).forEach((key) => {
        errMsg += `${constraints[key]};`;
      });
    });
    throw new Error(errMsg);
  }
  return validatedConfig;
}

export * from './typeorm';
