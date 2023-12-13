import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { APP_DATA_SOURCE_TOKEN } from './tokens/APP_DATA_SOURCE_TOKEN';
import { DatabaseContext } from '../database-context/DatabaseContext';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(APP_DATA_SOURCE_TOKEN)
    private appDataSource: DataSource,
  ) {}

  async getAppDataSource(): Promise<DataSource> {
    return this.appDataSource;
  }

  async getDatabaseContextApp() {
    const dataSource = await this.getAppDataSource();
    return new DatabaseContext(dataSource);
  }
}
