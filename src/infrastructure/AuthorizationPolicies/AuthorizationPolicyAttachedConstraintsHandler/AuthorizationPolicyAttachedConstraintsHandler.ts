import { AnyIterable, IAuthorizationPolicyAttachedConstraint, ITargetActor } from '../../../domain';
import { AuthorizationPolicyAttachedConstraintHandler } from '../AuthorizationPolicyAttachedConstraintHandler';

export class AuthorizationPolicyAttachedConstraintsHandler {
  static async *buildAttachedStatements(
    attachedConstraintsIterable: AnyIterable<IAuthorizationPolicyAttachedConstraint>,
    targetActor: ITargetActor,
  ) {
    for await (const attachedConstraint of attachedConstraintsIterable) {
      yield* AuthorizationPolicyAttachedConstraintHandler.construct(attachedConstraint, targetActor);
    }
  }
}
