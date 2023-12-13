import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  IAuthorizationPolicyConditionType,
  IAuthorizationPolicyConstraintAttachedStatementBehaviour,
  IAuthorizationPolicyConstraintStatementJoinMode,
  IAuthorizationPolicyMixedStatement,
} from '@sisgea/authorization-policies-core';
import { extractAliasesMappingsFromMixedStatement } from '@sisgea/authorization-policies-core/dist/core/AuthorizationPolicies/AuthorizationPolicyConstraintAttachedStatementsMixer/AuthorizationPolicyConstraintAttachedStatementsMixerUtils';
import { get } from 'lodash';
import { ITargetActor } from '../../../domain';
import { AuthorizationPolicyConditionInterpreterTypeORMPostgres } from '../../../infrastructure/authorization-policies/AuthorizationPolicyConditionInterpreters';
import { DatabaseAppResources } from '../../../infrastructure/database/database-app-resources/database-app-resources';
import { DatabaseService } from '../../../infrastructure/database/database.service';
import { IResolutionResolver, IResolutionResolverDatabase, IResolutionResolverStrategy } from './domain/IResolutionResolver';
import { getBestResolutionStrategyForMixedStatement } from './utils/getBestResolutionStrategyForMixedStatement';

@Injectable()
export class AppAuthorizationPoliciesResolversService {
  constructor(
    //
    private databaseService: DatabaseService,
  ) {}

  async buildResolutionResolverCasl(
    targetActor: ITargetActor,
    action: string,
    resource: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resourceId: string | null = null,
    mixedStatement: IAuthorizationPolicyMixedStatement,
  ): Promise<IResolutionResolver> {
    const builder = new AbilityBuilder(createMongoAbility);

    for (const subStatementMixed of mixedStatement.subStatementsMixed) {
      switch (subStatementMixed.where.type) {
        case IAuthorizationPolicyConditionType.VALUE_BOOLEAN: {
          const finalCondition =
            subStatementMixed.behaviour === IAuthorizationPolicyConstraintAttachedStatementBehaviour.APPROVE
              ? subStatementMixed.where.value
              : subStatementMixed.behaviour === IAuthorizationPolicyConstraintAttachedStatementBehaviour.REJECT
              ? !subStatementMixed.where.value
              : null;

          if (finalCondition === true) {
            builder.can(action, resource);
          } else if (finalCondition === false) {
            builder.cannot(action, resource);
          }

          break;
        }
      }
    }

    const ability = builder.build();

    return {
      strategy: IResolutionResolverStrategy.CASL,
      async check() {
        return ability.can(action, resource);
      },
    };
  }

  async buildResolutionResolverDatabase(
    targetActor: ITargetActor,
    action: string,
    resource: string,
    resourceIdJSON: string | null = null,
    mixedStatement: IAuthorizationPolicyMixedStatement,
  ): Promise<IResolutionResolverDatabase> {
    const literalResourceId = resourceIdJSON !== null ? JSON.parse(resourceIdJSON) : null;

    //

    const databaseContext = await this.databaseService.getDatabaseContextApp();

    const repository = databaseContext.getProjectionRepositoryForResource(resource);

    if (!repository) {
      throw new InternalServerErrorException();
    }

    const typeormInterpreter = new AuthorizationPolicyConditionInterpreterTypeORMPostgres(
      DatabaseAppResources,
      extractAliasesMappingsFromMixedStatement(mixedStatement, resource),
    );

    //

    const databaseQueries: { sql: string; params: any[]; concat: 'union' | 'except' }[] = [];

    //

    for (const subStatementMixed of mixedStatement.subStatementsMixed) {
      const subStatementQueryBuilder = repository.createQueryBuilder(mixedStatement.alias);

      const interpretedWhere = typeormInterpreter.interpret(subStatementMixed.where);

      subStatementQueryBuilder.where(interpretedWhere.sql, interpretedWhere.params);

      for (const join of subStatementMixed.joins) {
        switch (join.mode) {
          case IAuthorizationPolicyConstraintStatementJoinMode.INNER: {
            const interpretedInnerJoin = typeormInterpreter.interpret(join.on_condition);

            subStatementQueryBuilder.innerJoin(join.b_resource, join.b_alias, interpretedInnerJoin.sql, interpretedInnerJoin.params);

            break;
          }

          default: {
            break;
          }
        }
      }

      if (literalResourceId !== null) {
        subStatementQueryBuilder.andWhere(`${mixedStatement.alias}.id = :literalResourceId`, { literalResourceId });
      }

      subStatementQueryBuilder.select(`${mixedStatement.alias}.id`);

      const [sql, params] = subStatementQueryBuilder.getQueryAndParameters();

      switch (subStatementMixed.behaviour) {
        case IAuthorizationPolicyConstraintAttachedStatementBehaviour.APPROVE: {
          databaseQueries.push({
            sql,
            params,
            concat: 'union',
          });

          break;
        }

        case IAuthorizationPolicyConstraintAttachedStatementBehaviour.REJECT: {
          databaseQueries.push({
            sql,
            params,
            concat: 'except',
          });

          break;
        }

        default: {
          break;
        }
      }
    }

    const { sql, params } = databaseQueries.reduce<{ sql: string | null; params: any[] }>(
      (acc, i) => {
        switch (i.concat) {
          case 'union': {
            if (acc.sql === null) {
              return {
                sql: i.sql,
                params: [...acc.params, ...i.params],
              };
            } else {
              return {
                sql: `(${acc.sql}) UNION (${i.sql})`,
                params: [...acc.params, ...i.params],
              };
            }
          }

          case 'except': {
            if (acc.sql === null) {
              return {
                sql: null,
                params: [],
              };
            } else {
              return {
                sql: `(${acc.sql}) EXCEPT (${i.sql})`,
                params: [...acc.params, ...i.params],
              };
            }
          }
        }
      },
      { sql: null, params: [] },
    );

    return {
      strategy: IResolutionResolverStrategy.DATABASE,

      async check() {
        if (sql === null) {
          return false;
        }

        if (literalResourceId === null) {
          return true;
        }

        return await databaseContext.dataSource.transaction(async (entityManager) => {
          const queryRunner = entityManager.queryRunner;

          const result = await queryRunner.query(`SELECT (EXISTS (${sql})) as check;`, params, true);

          const record = result.records[0];

          return record['check'];
        });
      },

      async *streamIdsJson() {
        if (sql === null) {
          return;
        }

        const queryRunner = databaseContext.dataSource.createQueryRunner();

        const stream = await queryRunner.stream(sql, params);

        for await (const chunk of stream) {
          const alias = mixedStatement.alias;
          yield JSON.stringify(get(chunk, `${alias}_id`));
        }
      },
    };
  }

  async buildResolutionResolver(
    targetActor: ITargetActor,
    action: string,
    resource: string,
    resourceId: string | null = null,
    mixedStatement: IAuthorizationPolicyMixedStatement,
  ) {
    const resolutionStrategy = getBestResolutionStrategyForMixedStatement(action, resource, resourceId, mixedStatement);

    switch (resolutionStrategy) {
      case IResolutionResolverStrategy.CASL: {
        return await this.buildResolutionResolverCasl(targetActor, action, resource, resourceId, mixedStatement);
      }

      case IResolutionResolverStrategy.DATABASE: {
        return await this.buildResolutionResolverDatabase(targetActor, action, resource, resourceId, mixedStatement);
      }
    }
  }
}
