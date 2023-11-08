import { Module } from '@nestjs/common';
import { AutorizacaoModule } from './infrastructure/app/autorizacao/autorizacao.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { DbEventsModule } from './infrastructure/db-events/db-events.module';
import { EnvironmentConfigModule } from './infrastructure/environment-config';
import { MessageBrokerModule } from './infrastructure/message-broker/message-broker.module';

@Module({
  imports: [
    EnvironmentConfigModule,
    //
    DatabaseModule,
    //
    MessageBrokerModule,
    DbEventsModule,
    //
    AutorizacaoModule,
  ],
  providers: [
    //
  ],
})
export class AppModule {}
