import { Injectable } from '@nestjs/common';
import { AllowedResourceResponse, CanResponse, GenericCanRequest, UsuarioCanRequest } from '@sisgea/autorizacao-client';
import { ITargetActor, ITargetActorKind } from '../../../domain';
import { AuthorizationPoliciesService } from '../authorization-policies/authorization-policies.service';

@Injectable()
export class SisgeaAutorizacaoService {
  constructor(
    //
    private authorizationPoliciesService: AuthorizationPoliciesService,
  ) {}

  // ...

  private async genericCan<T extends GenericCanRequest = GenericCanRequest>(targetActor: ITargetActor, data: T): Promise<CanResponse> {
    const can = await this.authorizationPoliciesService.targetActorCan(targetActor, data.action, data.resource, data.resourceIdJson);

    return {
      can: can,
    };
  }

  //

  async anonymousCan(data: GenericCanRequest): Promise<CanResponse> {
    const targetActor = <ITargetActor>{
      kind: ITargetActorKind.ANONONYMOUS,
    };

    return this.genericCan(targetActor, data);
  }

  async internalSystemCan(data: GenericCanRequest): Promise<CanResponse> {
    const targetActor = <ITargetActor>{
      kind: ITargetActorKind.SYSTEM,
    };

    return this.genericCan(targetActor, data);
  }

  async usuarioCan(data: UsuarioCanRequest): Promise<CanResponse> {
    const targetActor = <ITargetActor>{
      kind: ITargetActorKind.USER,
      usuarioId: data.usuarioId,
    };

    return this.genericCan(targetActor, data);
  }

  // ...

  private async *genericAllowedResources<T extends GenericCanRequest = GenericCanRequest>(
    targetActor: ITargetActor,
    data: T,
  ): AsyncIterable<AllowedResourceResponse> {
    const allowedResources = this.authorizationPoliciesService.targetActorAllowedResources(targetActor, data.action, data.resource);

    yield* allowedResources;
  }

  //

  async *anonymousAllowedResources(data: GenericCanRequest): AsyncIterable<AllowedResourceResponse> {
    const targetActor = <ITargetActor>{
      kind: ITargetActorKind.ANONONYMOUS,
    };

    yield* this.genericAllowedResources(targetActor, data);
  }

  async *internalSystemAllowedResources(data: GenericCanRequest): AsyncIterable<AllowedResourceResponse> {
    const targetActor = <ITargetActor>{
      kind: ITargetActorKind.SYSTEM,
    };

    yield* this.genericAllowedResources(targetActor, data);
  }

  //

  async *usuarioAllowedResources(data: UsuarioCanRequest): AsyncIterable<AllowedResourceResponse> {
    const targetActor = <ITargetActor>{
      kind: ITargetActorKind.USER,
      usuarioId: data.usuarioId,
    };

    yield* this.genericAllowedResources(targetActor, data);
  }

  // ...
}
