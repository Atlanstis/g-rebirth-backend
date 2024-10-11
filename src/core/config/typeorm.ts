import { DataSource, DataSourceOptions } from 'typeorm';
import { yamlConfiguration } from '.';
import { MysqlConf } from '../classes';

const mysqlConfing = yamlConfiguration().mysql as MysqlConf;

export const ormConfig: DataSourceOptions = {
  type: 'mysql',
  entities: [],
  ...mysqlConfing,
  synchronize: false,
  dateStrings: true,
  poolSize: 10,
  logging: true,
};

export default new DataSource({ ...ormConfig, migrations: ['migrations/**'] });
