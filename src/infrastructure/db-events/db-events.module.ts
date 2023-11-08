import { Module } from '@nestjs/common';
import { MessageBrokerModule } from '../message-broker/message-broker.module';
import { DbEventsService } from './db-events.service';

@Module({
  imports: [
    //
    MessageBrokerModule,
  ],
  providers: [
    //
    DbEventsService,
  ],
  exports: [
    //
    DbEventsService,
  ],
})
export class DbEventsModule {}
