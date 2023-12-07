import { ITargetActorAnonymous, ITargetActorKind, ITargetActorSystem, ITargetActorUser } from '../../domain';

export const createTargetActorAnonymous = (): ITargetActorAnonymous => ({
  kind: ITargetActorKind.ANONONYMOUS,
});

export const createTargetActorSystem = (): ITargetActorSystem => ({
  kind: ITargetActorKind.SYSTEM,
});

export const createTargetActorUser = (usuarioId: string): ITargetActorUser => ({
  kind: ITargetActorKind.USER,
  usuarioId: usuarioId,
});
