export enum ITargetActorKind {
  USER = 'user',
  SYSTEM = 'system',
  ANONONYMOUS = 'anon',
}

export type ITargetActorAnonymous = {
  kind: ITargetActorKind.ANONONYMOUS;
};

export type ITargetActorSystem = {
  kind: ITargetActorKind.SYSTEM;
};

export type ITargetActorUser = {
  kind: ITargetActorKind.USER;
  usuarioId: string;
};

export type ITargetActor = ITargetActorAnonymous | ITargetActorSystem | ITargetActorUser;
