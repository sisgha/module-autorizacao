import { Injectable } from '@nestjs/common';
import { AllowedResourceResponse, CanResponse, GenericCanRequest, UsuarioCanRequest } from '@sisgea/autorizacao-client';
import { ITargetActor } from '../../../domain';
import {
  createTargetActorAnonymous,
  createTargetActorSystem,
  createTargetActorUser,
} from '../../../infrastructure/target-actor/target-actor.utils';
import { AppAuthorizationPoliciesRunnerService } from '../app-authorization-policies-runner/app-authorization-policies-runner.service';

@Injectable()
export class SisgeaAutorizacaoService {
  constructor(
    //
    private appAuthorizationPoliciesRunnerService: AppAuthorizationPoliciesRunnerService,
  ) {}

  // ...

  async anonymousCan(data: GenericCanRequest): Promise<CanResponse> {
    return this.genericCan(createTargetActorAnonymous(), data);
  }

  //

  async internalSystemCan(data: GenericCanRequest): Promise<CanResponse> {
    return this.genericCan(createTargetActorSystem(), data);
  }

  async usuarioCan(data: UsuarioCanRequest): Promise<CanResponse> {
    return this.genericCan(createTargetActorUser(data.usuarioId), data);
  }

  async *anonymousAllowedResources(data: GenericCanRequest): AsyncIterable<AllowedResourceResponse> {
    yield* this.genericAllowedResources(createTargetActorAnonymous(), data);
  }

  // ...

  async *internalSystemAllowedResources(data: GenericCanRequest): AsyncIterable<AllowedResourceResponse> {
    yield* this.genericAllowedResources(createTargetActorSystem(), data);
  }

  //

  async *usuarioAllowedResources(data: UsuarioCanRequest): AsyncIterable<AllowedResourceResponse> {
    yield* this.genericAllowedResources(createTargetActorUser(data.usuarioId), data);
  }

  private async genericCan<T extends GenericCanRequest = GenericCanRequest>(targetActor: ITargetActor, data: T): Promise<CanResponse> {
    const can = await this.appAuthorizationPoliciesRunnerService.targetActorCan(
      targetActor,
      data.action,
      data.resource,
      data.resourceIdJson,
    );

    return {
      can: can,
    };
  }

  //

  private async *genericAllowedResources<T extends GenericCanRequest = GenericCanRequest>(
    targetActor: ITargetActor,
    data: T,
  ): AsyncIterable<AllowedResourceResponse> {
    const allowedResources = this.appAuthorizationPoliciesRunnerService.targetActorAllowedResources(
      targetActor,
      data.action,
      data.resource,
    );

    yield* allowedResources;
  }

  // ...
}
