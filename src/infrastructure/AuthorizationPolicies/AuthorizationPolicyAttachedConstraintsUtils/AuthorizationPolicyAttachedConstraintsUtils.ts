import { IAuthorizationPolicyAttachedConstraintKind } from '@sisgea/authorization-policies-core';
import { ITargetActor, ITargetActorKind } from '../../../domain';
import { IFilterAttachedConstraintsForTargetActor } from '../_interfaces/IAuthorizationPolicyAttachedConstraintsUtils';

export const filterAttachedConstraintsForTargetActor: IFilterAttachedConstraintsForTargetActor<ITargetActor> = async function* (
  attachedConstraintsIterable,
  targetActor,
  deps,
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
