import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentConfigModule } from '../../../environment-config/environment-config.module';

@Module({
  imports: [
    // ...
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EnvironmentConfigModule,
  ],
  providers: [
    // ...
  ],
})
export class DataSourceSetupModule {}
