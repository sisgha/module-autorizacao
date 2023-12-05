import {
  IAuthorizationPolicy,
  IAuthorizationPolicyAttachedConstraint,
  IAuthorizationPolicyBuildContext,
  IAuthorizationPolicyBuildContextApply,
} from '../../../domain';
import { IAuthorizationPolicyConstraint } from '../../../domain/AuthorizationPolicies/AuthorizationPolicyConstraint';
import {
  createAttachedConstraintForAuthedUsuario,
  createAttachedConstraintForEveryone,
  createAttachedConstraintForRoles,
} from './AuthorizationPolicyHandlerUtils';

export class AuthorizationPolicyHandler {
  static async buildAttachedConstraints(authorizationPolicy: IAuthorizationPolicy) {
    const attachedConstraints = new Set<IAuthorizationPolicyAttachedConstraint>();

    const ctx: IAuthorizationPolicyBuildContext = {
      apply(constraint: IAuthorizationPolicyConstraint) {
        return <IAuthorizationPolicyBuildContextApply>{
          for_everyone() {
            attachedConstraints.add(createAttachedConstraintForEveryone(authorizationPolicy, constraint));
          },

          for_roles(roles: string[] | string) {
            attachedConstraints.add(createAttachedConstraintForRoles(authorizationPolicy, constraint, roles));
          },

          for_authed_usuario() {
            attachedConstraints.add(createAttachedConstraintForAuthedUsuario(authorizationPolicy, constraint));
          },
        };
      },
    };

    await authorizationPolicy.build(ctx);

    return attachedConstraints;
  }
}
