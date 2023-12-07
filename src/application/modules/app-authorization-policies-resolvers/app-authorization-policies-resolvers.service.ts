import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IAuthorizationPolicyConditionType, IAuthorizationPolicyMixedStatement } from '@sisgea/authorization-policies-core';
import { extractAliasesMappingsFromMixedStatement } from '@sisgea/authorization-policies-core/dist/core/AuthorizationPolicies/AuthorizationPolicyConstraintAttachedStatementsMixer/AuthorizationPolicyConstraintAttachedStatementsMixerUtils';
import { ITargetActor } from '../../../domain';
import { AuthorizationPolicyConditionInterpreterTypeORMPostgres } from '../../../infrastructure/authorization-policies/AuthorizationPolicyConditionInterpreters';
import { DatabaseAppResources } from '../../../infrastructure/database/database-app-resources/database-app-resources';
import { DatabaseService } from '../../../infrastructure/database/database.service';
import { getBestResolutionStrategyForMixedStatement } from './utils/getBestResolutionStrategyForMixedStatement';
import { IResolutionResolver, IResolutionResolverDatabase, IResolutionResolverStrategy } from './domain/IResolutionResolver';

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

    switch (mixedStatement.where.type) {
      case IAuthorizationPolicyConditionType.VALUE_BOOLEAN: {
        if (mixedStatement.where.value) {
          builder.can(action, resource);
        } else {
          builder.cannot(action, resource);
        }

        break;
      }
    }

    const ability = builder.build();

    return {
      strategy: IResolutionResolverStrategy.CASL,
      ability,
    };
  }

  async buildResolutionResolverDatabase(
    targetActor: ITargetActor,
    action: string,
    resource: string,
    resourceIdJSON: string | null = null,
    mixedStatement: IAuthorizationPolicyMixedStatement,
  ): Promise<IResolutionResolverDatabase> {
    const databaseContext = await this.databaseService.getDatabaseContextApp();
    const repository = databaseContext.getProjectionRepositoryForResource(resource);

    if (!repository) {
      throw new InternalServerErrorException();
    }

    const qb = repository.createQueryBuilder(mixedStatement.alias);

    const typeormInterpreter = new AuthorizationPolicyConditionInterpreterTypeORMPostgres(
      DatabaseAppResources,
      extractAliasesMappingsFromMixedStatement(mixedStatement, resource),
    );

    const interpretedWhere = typeormInterpreter.interpret(mixedStatement.where);

    qb.where(interpretedWhere.sql, interpretedWhere.params);

    for (const inner_join of mixedStatement.inner_joins) {
      const interpretedInnerJoin = typeormInterpreter.interpret(inner_join.on_condition);

      qb.innerJoin(inner_join.b_resource, inner_join.b_alias, interpretedInnerJoin.sql, interpretedInnerJoin.params);
    }

    const literalResourceId = resourceIdJSON !== null ? JSON.parse(resourceIdJSON) : null;

    if (literalResourceId !== null) {
      qb.andWhere(`${mixedStatement.alias}.id = :literalResourceId`, { literalResourceId });
    }

    qb.select(`${mixedStatement.alias}.id`);

    return {
      strategy: IResolutionResolverStrategy.DATABASE,
      qb,
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
