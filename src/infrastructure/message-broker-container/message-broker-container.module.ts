import { Module } from '@nestjs/common';
import { MessageBrokerContainerService } from './message-broker-container.service';

@Module({
  providers: [
    //
    MessageBrokerContainerService,
  ],
  exports: [
    //
    MessageBrokerContainerService,
  ],
})
export class MessageBrokerContainerModule {}
