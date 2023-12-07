import { Injectable } from '@nestjs/common';
import { AllowedResourceResponse } from '@sisgea/autorizacao-client';
import { get } from 'lodash';
import { ITargetActor } from '../../../domain';
import { IFilterAttachedConstraintsForTargetActorDependencies } from '../../../infrastructure/AuthorizationPolicies/interfaces/IAuthorizationPolicyAttachedConstraintsUtils';
import { AppAuthorizationPoliciesRepositoryService } from '../app-authorization-policies-repository/app-authorization-policies-repository.service';
import { AppAuthorizationPoliciesResolversService } from '../app-authorization-policies-resolvers/app-authorization-policies-resolvers.service';
import { IResolution } from '../app-authorization-policies-resolvers/domain/IResolution';
import {
  IResolutionResolverDatabase,
  IResolutionResolverStrategy,
} from '../app-authorization-policies-resolvers/domain/IResolutionResolver';

@Injectable()
export class AppAuthorizationPoliciesRunnerService {
  constructor(
    //
    private appAuthorizationPoliciesRepositoryService: AppAuthorizationPoliciesRepositoryService,
    private appAuthorizationPoliciesResolversService: AppAuthorizationPoliciesResolversService,
  ) {}

  async checkRoles(targetActor: ITargetActor, roles: string[]) {
    // TODO
    console.log('TODO: checkRoles', { targetActor, roles });
    return false;
  }

  private async buildMixedStatement(targetActor: ITargetActor, action: string, resource: string) {
    const checkRoles = this.checkRoles.bind(this);

    const deps: IFilterAttachedConstraintsForTargetActorDependencies = {
      checkRoles,
    };

    return this.appAuthorizationPoliciesRepositoryService.buildMixedStatement(targetActor, action, resource, deps);
  }

  private async getResolution(
    targetActor: ITargetActor,
    action: string,
    resource: string,
    resourceId: string | null = null,
  ): Promise<IResolution> {
    const mixedStatement = await this.buildMixedStatement(targetActor, action, resource);

    const resolver = await this.appAuthorizationPoliciesResolversService.buildResolutionResolver(
      targetActor,
      action,
      resource,
      resourceId,
      mixedStatement,
    );

    return {
      resolver,
      mixedStatement,
    };
  }

  async getResolutionDatabase(
    targetActor: ITargetActor,
    action: string,
    resource: string,
    resourceId: string | null = null,
  ): Promise<IResolution<IResolutionResolverDatabase>> {
    const mixedStatement = await this.buildMixedStatement(targetActor, action, resource);

    const resolver = await this.appAuthorizationPoliciesResolversService.buildResolutionResolverDatabase(
      targetActor,
      action,
      resource,
      resourceId,
      mixedStatement,
    );

    return {
      resolver,
      mixedStatement,
    };
  }

  async targetActorCan(targetActor: ITargetActor, action: string, resource: string, resourceIdJson: string | null = null) {
    const { resolver: resolver } = await this.getResolution(targetActor, action, resource, resourceIdJson);

    switch (resolver.strategy) {
      case IResolutionResolverStrategy.DATABASE: {
        const exists = await resolver.qb.getExists();
        return exists;
      }

      case IResolutionResolverStrategy.CASL: {
        const can = resolver.ability.can(action, resource);
        return can;
      }

      default: {
        return false;
      }
    }
  }

  async *targetActorAllowedResources(targetActor: ITargetActor, action: string, resource: string): AsyncIterable<AllowedResourceResponse> {
    const { resolver, mixedStatement } = await this.getResolutionDatabase(targetActor, action, resource, null);

    const stream = await resolver.qb.stream();

    for await (const chunk of stream) {
      const alias = mixedStatement.alias;

      const allowedResourceResponse = <AllowedResourceResponse>{
        resourceIdJson: JSON.stringify(get(chunk, `${alias}_id`)),
      };

      yield allowedResourceResponse;
    }
  }
}
