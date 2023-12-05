import { Injectable } from '@nestjs/common';
import { UsuarioCanRequest, UsuarioCanResponse } from '@sisgea/autorizacao-client';
import { ITargetActor, ITargetActorKind } from '../../../domain';
import { AuthorizationPoliciesService } from '../authorization-policies/authorization-policies.service';

@Injectable()
export class AutorizacaoService {
  constructor(
    //
    private authorizationPoliciesService: AuthorizationPoliciesService,
  ) {}

  async usuarioCan(data: UsuarioCanRequest): Promise<UsuarioCanResponse> {
    const targetActor = <ITargetActor>{
      kind: ITargetActorKind.USER,
      usuarioId: data.usuarioId,
    };

    const can = await this.authorizationPoliciesService.targetActorCan(targetActor, data.action, data.resource, data.resourceId ?? null);

    return {
      can: can,
    };
  }
}
