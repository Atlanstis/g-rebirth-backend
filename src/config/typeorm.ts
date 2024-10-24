import { DataSource, DataSourceOptions } from 'typeorm';
import { yamlConfiguration } from '.';
import { MysqlConf } from 'src/core';
import { UserAuthMethod, User, Role, Menu } from 'src/entities';

const mysqlConfing = yamlConfiguration().mysql as MysqlConf;

export const ormConfig: DataSourceOptions = {
  type: 'mysql',
  entities: [User, UserAuthMethod, Role, Menu],
  ...mysqlConfing,
  dateStrings: true,
  poolSize: 10,
  logging: true,
};

export default new DataSource({ ...ormConfig, migrations: ['migrations/**'] });
