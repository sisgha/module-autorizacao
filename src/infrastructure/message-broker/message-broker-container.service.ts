import { Injectable } from '@nestjs/common';
import { BrokerAsPromised as Broker, BrokerConfig } from 'rascal';
import { EnvironmentConfigService } from '../environment-config';

@Injectable()
export class MessageBrokerContainerService {
  #broker: Broker | null = null;

  constructor(
    //
    private environmentConfigService: EnvironmentConfigService,
  ) {}

  async setup() {
    if (this.#broker === null) {
      const config = this.getConfig();

      const broker = await Broker.create(config);
      broker.on('error', console.error);

      this.#broker = broker;
    }

    return this.#broker;
  }

  async getBroker() {
    const broker = await this.setup();
    return broker;
  }

  getConfig(): BrokerConfig {
    const config: BrokerConfig = {
      vhosts: {
        '/': {
          connection: {
            url: this.environmentConfigService.getMessageBrokerConnectionURL(),
          },
          exchanges: {
            db_event: {
              type: 'topic',
              options: {
                durable: true,
              },
            },
          },
          queues: ['module_autenticacao_db_event_q'],
          bindings: ['db_event[#] -> module_autenticacao_db_event_q'],
          subscriptions: {
            module_autenticacao_db_event_sub: {
              queue: 'module_autenticacao_db_event_q',
              prefetch: 3,
              options: {
                exclusive: true,
              },
            },
          },
        },
      },
    };

    return config;
  }
}
