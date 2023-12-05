import { AnyIterable } from '../../AnyIterable';
import { ITargetActor } from '../../sisgea';
import { IAuthorizationPolicyAttachedConstraint } from '../AuthorizationPolicyAttachedConstraint';

export type IFilterAttachedConstraintsForTargetActorDependencies = {
  checkRoles(roles: string[], targetActor: ITargetActor): Promise<boolean>;
};

export type IFilterAttachedConstraintsForTargetActor = (
  attachedConstraintsIterable: AnyIterable<IAuthorizationPolicyAttachedConstraint>,

  targetActor: ITargetActor,

  deps: IFilterAttachedConstraintsForTargetActorDependencies,
) => AsyncIterable<IAuthorizationPolicyAttachedConstraint>;
