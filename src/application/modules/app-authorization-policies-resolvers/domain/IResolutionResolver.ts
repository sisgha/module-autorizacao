import { AbilityTuple, MongoAbility, MongoQuery } from '@casl/ability';
import { GenericProjection } from '../../../../domain';
import { SelectQueryBuilder } from 'typeorm';

export enum IResolutionResolverStrategy {
  CASL = 'casl',
  DATABASE = 'db',
}

export type IResolutionResolverCasl = {
  strategy: IResolutionResolverStrategy.CASL;
  ability: MongoAbility<AbilityTuple, MongoQuery>;
};

export type IResolutionResolverDatabase = {
  strategy: IResolutionResolverStrategy.DATABASE;
  qb: SelectQueryBuilder<GenericProjection<unknown>>;
};

export type IResolutionResolver = IResolutionResolverCasl | IResolutionResolverDatabase;
