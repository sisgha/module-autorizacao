import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AllowedResourceResponse } from '@sisgea/autorizacao-client';
import { get } from 'lodash';
import { extractAliasesMappingsFromMixedStatement } from 'src/infrastructure/AuthorizationPolicies/AuthorizationPolicyConstraintAttachedStatementsMixer/AuthorizationPolicyConstraintAttachedStatementsMixerUtils';
import {
  IAuthorizationPolicyConstraintStatementBuilderSpecialAction,
  IAuthorizationPolicyConstraintStatementBuilderSpecialTarget,
  IAuthorizationPolicyMixedStatement,
  IFilterAttachedConstraintsForTargetActorDependencies,
  ITargetActor,
} from '../../../domain';
import { AuthorizationPoliciesHandler } from '../../../infrastructure/AuthorizationPolicies/AuthorizationPoliciesHandler';
import { AuthorizationPolicyAttachedConstraintsHandler } from '../../../infrastructure/AuthorizationPolicies/AuthorizationPolicyAttachedConstraintsHandler';
import { filterAttachedConstraintsForTargetActor } from '../../../infrastructure/AuthorizationPolicies/AuthorizationPolicyAttachedConstraintsUtils';
import { AuthorizationPolicyConditionInterpreterTypeORM } from '../../../infrastructure/AuthorizationPolicies/AuthorizationPolicyConditionInterpreters/AuthorizationPolicyConditionInterpreterTypeORM';
import { AuthorizationPolicyConstraintAttachedStatementMixer } from '../../../infrastructure/AuthorizationPolicies/AuthorizationPolicyConstraintAttachedStatementsMixer/AuthorizationPolicyConstraintAttachedStatementMixer';
import { DatabaseAppResources } from '../../../infrastructure/database/database-app-resources/database-app-resources';
import { DatabaseService } from '../../../infrastructure/database/database.service';
import { AllPolicies } from '../../policies/AllPolicies';
import { getBestResolutionStrategyForCheck } from './utils/getBestResolutionStrategyForCheck';

@Injectable()
export class AuthorizationPoliciesService {
  constructor(
    //
    private databaseService: DatabaseService,
  ) {}

  async checkRoles(targetActor: ITargetActor, roles: string[]) {
    console.log('TODO: checkRoles', { targetActor, roles });
    return true;
  }

  private *getPolicies() {
    yield* AllPolicies;
  }

  private async getAuthorizationPoliciesHandler() {
    const authorizationPoliciesHandler = new AuthorizationPoliciesHandler();
    await authorizationPoliciesHandler.addPolicies(this.getPolicies());
    return authorizationPoliciesHandler;
  }

  private async *getAllAttachedConstraints() {
    const authorizationPoliciesHandler = await this.getAuthorizationPoliciesHandler();
    yield* authorizationPoliciesHandler.buildAttachedConstraints();
  }

  private async *getAttachedConstraintsForTargetActor(targetActor: ITargetActor) {
    const allAttachedConstraintsIterable = this.getAllAttachedConstraints();

    const checkRoles = this.checkRoles.bind(this);

    const deps: IFilterAttachedConstraintsForTargetActorDependencies = {
      checkRoles,
    };

    yield* filterAttachedConstraintsForTargetActor(allAttachedConstraintsIterable, targetActor, deps);
  }

  async *getMatchedAttachedStatements(targetActor: ITargetActor, action: string, resource: string) {
    const attachedConstraintsForTargetActor = this.getAttachedConstraintsForTargetActor(targetActor);

    const attachedStatements = AuthorizationPolicyAttachedConstraintsHandler.buildAttachedStatements(
      attachedConstraintsForTargetActor,
      targetActor,
    );

    for await (const attachedStatement of attachedStatements) {
      if (
        (attachedStatement.action === IAuthorizationPolicyConstraintStatementBuilderSpecialAction.MANAGE ||
          attachedStatement.action.includes(action)) &&
        (attachedStatement.target === IAuthorizationPolicyConstraintStatementBuilderSpecialTarget.ALL ||
          attachedStatement.target.includes(resource))
      ) {
        yield attachedStatement;
      }
    }
  }

  private async buildMixedStatement(targetActor: ITargetActor, action: string, resource: string) {
    const matchedAttachedStatements = this.getMatchedAttachedStatements(targetActor, action, resource);

    const mixer = new AuthorizationPolicyConstraintAttachedStatementMixer();
    await mixer.addAttachedStatements(matchedAttachedStatements);

    return mixer.state;
  }

  private async getResolution(targetActor: ITargetActor, action: string, resource: string, resourceId: string | null = null) {
    const mixedStatement = await this.buildMixedStatement(targetActor, action, resource);

    const resolutionStrategy = getBestResolutionStrategyForCheck(action, resource, resourceId, mixedStatement);

    switch (resolutionStrategy) {
      case 'casl': {
        return this.buildResolutionCasl(targetActor, action, resource, resourceId, mixedStatement);
      }

      case 'database': {
        return await this.buildResolutionDatabase(targetActor, action, resource, resourceId, mixedStatement);
      }
    }
  }

  async getResolutionCasl(targetActor: ITargetActor, action: string, resource: string, resourceId: string | null = null) {
    const mixedStatement = await this.buildMixedStatement(targetActor, action, resource);
    return this.buildResolutionCasl(targetActor, action, resource, resourceId, mixedStatement);
  }

  async getResolutionDatabase(targetActor: ITargetActor, action: string, resource: string, resourceId: string | null = null) {
    const mixedStatement = await this.buildMixedStatement(targetActor, action, resource);
    return this.buildResolutionDatabase(targetActor, action, resource, resourceId, mixedStatement);
  }

  private buildResolutionCasl(
    targetActor: ITargetActor,
    action: string,
    resource: string,
    resourceId: string | null = null,
    mixedStatement: IAuthorizationPolicyMixedStatement,
  ) {
    const builder = new AbilityBuilder(createMongoAbility);

    switch (mixedStatement.where.type) {
      case 'true': {
        builder.can(action, resource);
        break;
      }

      case 'false': {
        builder.cannot(action, resource);
        break;
      }
    }

    const ability = builder.build();

    return {
      strategy: 'casl',
      ability,
    } as const;
  }

  private async buildResolutionDatabase(
    targetActor: ITargetActor,
    action: string,
    resource: string,
    resourceIdJSON: string | null = null,
    mixedStatement: IAuthorizationPolicyMixedStatement,
  ) {
    const databaseContext = await this.databaseService.getDatabaseContextApp();
    const repository = databaseContext.getProjectionRepositoryForResource(resource);

    if (!repository) {
      throw new InternalServerErrorException();
    }

    const qb = repository.createQueryBuilder(mixedStatement.alias);

    const typeormInterpreter = new AuthorizationPolicyConditionInterpreterTypeORM(
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
      strategy: 'db',
      qb,
    } as const;
  }

  async targetActorCan(targetActor: ITargetActor, action: string, resource: string, resourceIdJson: string | null = null) {
    const resolution = await this.getResolution(targetActor, action, resource, resourceIdJson);

    switch (resolution.strategy) {
      case 'db': {
        const exists = await resolution.qb.getExists();
        return exists;
      }

      case 'casl': {
        const can = resolution.ability.can(action, resource);
        return can;
      }

      default: {
        return false;
      }
    }
  }

  async *targetActorAllowedResources(targetActor: ITargetActor, action: string, resource: string): AsyncIterable<AllowedResourceResponse> {
    const resolution = await this.getResolutionDatabase(targetActor, action, resource, null);

    const stream = await resolution.qb.stream();

    for await (const chunk of stream) {
      const alias = 'row';

      const allowedResourceResponse = <AllowedResourceResponse>{
        resourceIdJson: JSON.stringify(get(chunk, `${alias}_id`)),
      };

      yield allowedResourceResponse;
    }
  }
}
