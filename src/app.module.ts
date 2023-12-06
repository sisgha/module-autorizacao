import { Module } from '@nestjs/common';
import { AuthorizationPoliciesModules } from './application/modules/authorization-policies/authorization-policies.module';
import { SisgeaAutorizacaoModule } from './application/modules/sisgea-autorizacao/sisgea-autorizacao.module';
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
    AuthorizationPoliciesModules,
    //
    SisgeaAutorizacaoModule,
  ],
  providers: [
    //
  ],
})
export class AppModule {}
