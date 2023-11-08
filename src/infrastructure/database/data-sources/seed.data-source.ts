import { DataSource, DataSourceOptions } from 'typeorm';
import { EnvironmentConfigService } from '../../environment-config/environment-config.service';
import { getDataSourceEnvironmentConfigService } from './utils/get-data-source-environment-config-service';

export const getSeedDataSource = async (environmentConfigServiceBase: EnvironmentConfigService | null = null) => {
  const environmentConfigService = await getDataSourceEnvironmentConfigService(environmentConfigServiceBase);

  const options = environmentConfigService.getTypeORMSeedDataSourceOptions();

  return new DataSource(options as DataSourceOptions);
};

const seedDataSource = getSeedDataSource();

export default seedDataSource;
