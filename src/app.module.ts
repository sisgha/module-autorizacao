import { Module } from '@nestjs/common';
import { AuthorizationPoliciesModules } from './application/modules/app-authorization-policies-runner/app-authorization-policies-runner.module';
import { SisgeaAutorizacaoModule } from './application/modules/sisgea-autorizacao/sisgea-autorizacao.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { MessageBrokerSubscriptionsModule } from './infrastructure/message-broker-subscriptions/message-broker-subscriptions.module';
import { EnvironmentConfigModule } from './infrastructure/environment-config';
import { MessageBrokerContainerModule } from './infrastructure/message-broker-container/message-broker-container.module';

@Module({
  imports: [
    EnvironmentConfigModule,
    //
    DatabaseModule,
    //
    MessageBrokerContainerModule,
    MessageBrokerSubscriptionsModule,
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
