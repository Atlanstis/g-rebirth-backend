import { DataSource, DataSourceOptions } from 'typeorm';
import { yamlConfiguration } from '.';
import { MysqlConf } from '../classes';
import { User, UserAuthMethod } from '../../modules';

const mysqlConfing = yamlConfiguration().mysql as MysqlConf;

export const ormConfig: DataSourceOptions = {
  type: 'mysql',
  entities: [User, UserAuthMethod],
  ...mysqlConfing,
  dateStrings: true,
  poolSize: 10,
  logging: true,
};

export default new DataSource({ ...ormConfig, migrations: ['migrations/**'] });
