import { AnyIterable } from '../../AnyIterable';
import { ITargetActor } from '../../sisgea';
import { IAuthorizationPolicyAttachedConstraint } from '../AuthorizationPolicyAttachedConstraint';

export type IFilterAttachedConstraintsForTargetActorDependencies = {
  checkRoles(targetActor: ITargetActor, roles: string[]): Promise<boolean>;
};

export type IFilterAttachedConstraintsForTargetActor = (
  attachedConstraintsIterable: AnyIterable<IAuthorizationPolicyAttachedConstraint>,

  targetActor: ITargetActor,

  deps: IFilterAttachedConstraintsForTargetActorDependencies,
) => AsyncIterable<IAuthorizationPolicyAttachedConstraint>;
