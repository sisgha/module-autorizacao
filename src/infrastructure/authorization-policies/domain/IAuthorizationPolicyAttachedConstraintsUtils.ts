export type IFilterAttachedConstraintsForTargetActorDependencies<TargetActor = unknown> = {
  checkRoles(targetActor: TargetActor, roles: string[]): Promise<boolean>;
};
