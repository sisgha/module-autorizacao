import { ISISGEANestSSOConfig } from '@sisgea/nest-sso';
import { IConfigDatabase } from './IConfigDatabase';
import { IConfigGRPCServer } from './IConfigGRPCServer';
import { IConfigMessageBroker } from './IConfigMessageBroker';
import { IConfigRuntime } from './IConfigRuntime';
import { IConfigTypeORM } from './IConfigTypeORM';
import { IConfigTypeORMDataSources } from './IConfigTypeORMDataSources';

export interface IConfig
  extends IConfigRuntime,
    IConfigDatabase,
    IConfigGRPCServer,
    IConfigTypeORM,
    IConfigTypeORMDataSources,
    ISISGEANestSSOConfig,
    IConfigMessageBroker {}
