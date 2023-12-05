import { IAuthorizationPolicyAttachedConstraintKind, IFilterAttachedConstraintsForTargetActor, ITargetActorKind } from '../../../domain';

export const filterAttachedConstraintsForTargetActor: IFilterAttachedConstraintsForTargetActor = async function* (
  attachedConstraintsIterable,
  targetActor,
  deps,
) {
  for await (const attachedConstraint of attachedConstraintsIterable) {
    switch (attachedConstraint.kind) {
      case IAuthorizationPolicyAttachedConstraintKind.AUTHED_USUARIO: {
        if (targetActor.kind === ITargetActorKind.USER) {
          yield attachedConstraint;
        }

        break;
      }

      case IAuthorizationPolicyAttachedConstraintKind.ROLES: {
        const hasRole = await deps.checkRoles(attachedConstraint.roles, targetActor);

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
