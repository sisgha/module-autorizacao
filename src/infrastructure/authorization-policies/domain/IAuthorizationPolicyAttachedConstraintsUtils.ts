import { IAnyIterable } from '@sisgea/authorization-policies-core/src/domain/IAnyIterable';
import { IAuthorizationPolicyAttachedConstraint } from '@sisgea/authorization-policies-core/src/domain/AuthorizationPolicies/IAuthorizationPolicyAttachedConstraint';

export type IFilterAttachedConstraintsForTargetActorDependencies<TargetActor = unknown> = {
  checkRoles(targetActor: TargetActor, roles: string[]): Promise<boolean>;
};

export type IFilterAttachedConstraintsForTargetActor<TargetActor = unknown> = (
  attachedConstraintsIterable: IAnyIterable<IAuthorizationPolicyAttachedConstraint>,
  targetActor: TargetActor,
  deps: IFilterAttachedConstraintsForTargetActorDependencies<TargetActor>,
) => AsyncIterable<IAuthorizationPolicyAttachedConstraint>;
