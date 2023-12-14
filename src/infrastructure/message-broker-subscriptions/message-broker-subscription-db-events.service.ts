import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Message } from 'amqplib';
import { AckOrNack, SubscriberSessionAsPromised } from 'rascal';
import { DataSource } from 'typeorm';
import { DbEventModel } from '../../domain';
import { DatabaseContext } from '../database-context/DatabaseContext';
import { APP_DATA_SOURCE_TOKEN } from '../database/tokens/APP_DATA_SOURCE_TOKEN';
import { extractDbEventDataDateUpdated } from '../db-events/db-events-utils/extract-db-event-date-updated';
import { parseDbEvent } from '../db-events/db-events-utils/parse-db-event';
import { PlaceholderUndefined } from '../db-events/db-events-utils/placeholder-undefined';
import { DbEventAction } from '../db-events/domain/DbEventAction';
import { HandleDbEventOutputReason } from '../db-events/domain/HandleDbEventOutputReason';
import { MessageBrokerContainerService } from '../message-broker-container/message-broker-container.service';

@Injectable()
export class MessageBrokerSubscriptionDbEventsService implements OnModuleInit {
  #subscription: SubscriberSessionAsPromised | null = null;

  constructor(
    //
    @Inject(APP_DATA_SOURCE_TOKEN)
    private appDataSource: DataSource,

    private messageBrokerContainerService: MessageBrokerContainerService,
  ) {}

  onModuleInit() {
    this.setup();
  }

  async setup() {
    if (!this.#subscription) {
      const broker = await this.messageBrokerContainerService.getBroker();

      const subscription = await broker.subscribe('module_autorizacao_db_event_sub');

      subscription.on('message', this.handleMessageBrokerIncomingDbEventMessage.bind(this));
      subscription.on('error', this.handleMessageBrokerIncomingDBEventError.bind(this));

      this.#subscription = subscription;
    }
  }

  async handleIncomingDbEvent(dbEvent: DbEventModel) {
    const databaseContext = DatabaseContext.new(this.appDataSource);

    const repository = databaseContext.getProjectionRepositoryForResource(dbEvent.resource);

    if (repository) {
      const dbEventData = dbEvent.data ?? null;
      const dbEventProjectionDateUpdated = extractDbEventDataDateUpdated(dbEventData);

      const localProjection = await repository
        .createQueryBuilder('row')
        .select(['row'])
        .where("row.data ->> 'id' = :rowId", { rowId: dbEvent.rowId })
        .getOne();

      const localProjectionData = localProjection?.data ?? null;
      const localProjectionDateUpdated = extractDbEventDataDateUpdated(localProjectionData);

      switch (dbEvent.action) {
        case DbEventAction.CREATE:
        case DbEventAction.INSERT:
        case DbEventAction.UPDATE: {
          // dbEventProjectionDateUpdated === PlaceholderUndefined => never when action in insert or update
          // dbEventProjectionDateUpdated < localProjectionDateUpdated => outdated data coming
          // localProjectionDateUpdated === PlaceholderUndefined => there is no local projection
          // dbEventProjectionDateUpdated > localProjectionDateUpdated => new data coming

          if (dbEventProjectionDateUpdated === PlaceholderUndefined) {
            return {
              success: false,
              reason: HandleDbEventOutputReason.INVALID_DB_EVENT,
            } as const;
          } else if (localProjectionDateUpdated !== PlaceholderUndefined && dbEventProjectionDateUpdated < localProjectionDateUpdated) {
            // outdated db event, just skip

            return {
              success: true,
              reason: null,
            } as const;
          } else if (localProjectionDateUpdated === PlaceholderUndefined) {
            const row = repository.create();

            row.id = <string>dbEvent.rowId;
            row.data = dbEvent.data;

            await repository.save(row);

            return {
              success: true,
              reason: null,
            } as const;
          } else if (dbEventProjectionDateUpdated > localProjectionDateUpdated && localProjection) {
            await repository.save({
              id: localProjection.id,
              data: dbEvent.data,
            });

            return {
              success: true,
              reason: null,
            } as const;
          }

          break;
        }

        case DbEventAction.DELETE: {
          // localProjection is not null => there is local projection
          // localProjection is null => no local projection exists

          if (localProjection !== null) {
            await repository.delete({ id: localProjection.id });
          }

          return {
            success: true,
            reason: null,
          } as const;
        }
      }
    }

    return {
      success: false,
      reason: HandleDbEventOutputReason.ERROR_UNKNOWN,
    } as const;
  }

  async handleMessageBrokerIncomingDbEventMessage(message: Message, content: any, ackOrNack: AckOrNack) {
    const messageContent = message.content.toString();
    const parseOutput = await parseDbEvent(messageContent);

    let outputReason: HandleDbEventOutputReason | null = null;

    if (parseOutput.success) {
      const handleOutput = await this.handleIncomingDbEvent(parseOutput.data);

      if (handleOutput.success) {
        outputReason = null;
      } else {
        console.debug({ handleOutput });
        outputReason = handleOutput.reason;
      }
    } else {
      console.debug({ parseOutput });
      outputReason = parseOutput.reason;
    }

    switch (outputReason) {
      case null: {
        ackOrNack(undefined, { strategy: 'ack' });
        break;
      }

      default:
      case HandleDbEventOutputReason.ERROR_UNKNOWN:
      case HandleDbEventOutputReason.INVALID_DB_EVENT: {
        console.debug(JSON.stringify(parseOutput.data, null, 2));

        console.error(`Could not properly handle db event (queue message id: ${message.properties.messageId})`);

        ackOrNack(new Error(String(outputReason)), { strategy: 'nack', defer: 1000, requeue: true });
        break;
      }
    }
  }

  handleMessageBrokerIncomingDBEventError(err: Error): void {
    console.error('Subscriber error', err);
  }
}
