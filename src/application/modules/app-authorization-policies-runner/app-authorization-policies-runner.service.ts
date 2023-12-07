import { Injectable } from '@nestjs/common';
import { AllowedResourceResponse } from '@sisgea/autorizacao-client';
import { ITargetActor } from '../../../domain';
import { IFilterAttachedConstraintsForTargetActorDependencies } from '../../../infrastructure/authorization-policies/domain/IAuthorizationPolicyAttachedConstraintsUtils';
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
    // TODO: a fazer

    const fallback = true;

    console.log('TODO: checkRoles', { targetActor, roles, result: fallback });

    return fallback;
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
        const check = await resolver.check();
        return check;
      }

      case IResolutionResolverStrategy.CASL: {
        const check = await resolver.check();
        return check;
      }

      default: {
        return false;
      }
    }
  }

  async *targetActorAllowedResources(targetActor: ITargetActor, action: string, resource: string): AsyncIterable<AllowedResourceResponse> {
    const { resolver } = await this.getResolutionDatabase(targetActor, action, resource, null);

    for await (const resourceIdJson of resolver.streamIdsJson()) {
      const allowedResourceResponse = <AllowedResourceResponse>{
        resourceIdJson: resourceIdJson,
      };

      yield allowedResourceResponse;
    }
  }
}
