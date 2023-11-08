import { DataSourceOptions } from 'typeorm';

export interface IConfigTypeORMDataSources {
  getTypeORMSharedDataSourceOptions(): Partial<DataSourceOptions>;
  getTypeORMAppDataSourceOptions(): DataSourceOptions;
  getTypeORMMigrationDataSourceOptions(): DataSourceOptions;
  getTypeORMSeedDataSourceOptions(): DataSourceOptions;
}
