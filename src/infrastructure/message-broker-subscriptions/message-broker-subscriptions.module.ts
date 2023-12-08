import { Module } from '@nestjs/common';
import { MessageBrokerContainerModule } from '../message-broker-container/message-broker-container.module';
import { MessageBrokerSubscriptionDbEventsService } from './message-broker-subscription-db-events.service';

@Module({
  imports: [
    //
    MessageBrokerContainerModule,
  ],
  providers: [
    //
    MessageBrokerSubscriptionDbEventsService,
  ],
  exports: [
    //
    MessageBrokerSubscriptionDbEventsService,
  ],
})
export class MessageBrokerSubscriptionsModule {}
