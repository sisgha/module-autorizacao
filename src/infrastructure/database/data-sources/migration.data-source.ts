import { DataSource, DataSourceOptions } from 'typeorm';
import { EnvironmentConfigService } from '../../environment-config/environment-config.service';
import { getDataSourceEnvironmentConfigService } from './utils/get-data-source-environment-config-service';

export const getMigrationDataSource = async (environmentConfigServiceBase: EnvironmentConfigService | null = null) => {
  const environmentConfigService = await getDataSourceEnvironmentConfigService(environmentConfigServiceBase);

  const options = environmentConfigService.getTypeORMMigrationDataSourceOptions();

  const dataSource = new DataSource(options as DataSourceOptions);

  return dataSource;
};

const migrationDataSource = getMigrationDataSource();

export default migrationDataSource;
