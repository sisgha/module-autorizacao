import {
  IAnyIterable,
  IAuthorizationPolicyAttachedConstraint,
  IAuthorizationPolicyAttachedConstraintKind,
} from '@sisgea/authorization-policies-core';
import { ITargetActor, ITargetActorKind } from '../../../domain';
import { IFilterAttachedConstraintsForTargetActorDependencies } from '../domain/IAuthorizationPolicyAttachedConstraintsUtils';

export const filterAttachedConstraintsForTargetActor = async function* <TargetActor extends ITargetActor = ITargetActor>(
  attachedConstraintsIterable: IAnyIterable<IAuthorizationPolicyAttachedConstraint<TargetActor>>,
  targetActor: TargetActor,
  deps: IFilterAttachedConstraintsForTargetActorDependencies<TargetActor>,
) {
  for await (const attachedConstraint of attachedConstraintsIterable) {
    switch (attachedConstraint.kind) {
      case IAuthorizationPolicyAttachedConstraintKind.AUTHED_USER: {
        if (targetActor.kind === ITargetActorKind.USER) {
          yield attachedConstraint;
        }

        break;
      }

      case IAuthorizationPolicyAttachedConstraintKind.ROLES: {
        const hasRole = await deps.checkRoles(targetActor, attachedConstraint.roles);

        if (hasRole) {
          yield attachedConstraint;
        }

        break;
      }

      case IAuthorizationPolicyAttachedConstraintKind.EVERYONE: {
        yield attachedConstraint;

        break;
      }
    }
  }
};
