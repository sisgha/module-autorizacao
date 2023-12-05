import { IAuthorizationPolicy } from '../AuthorizationPolicy/IAuthorizationPolicy';
import { IAuthorizationPolicyConstraint } from '../AuthorizationPolicyConstraint/IAuthorizationPolicyConstraint';
import { IAuthorizationPolicyAttachedConstraintKind } from './IAuthorizationPolicyAttachedConstraintKind';

export type IAuthorizationPolicyAttachedConstraintBase = {
  policy: IAuthorizationPolicy;
  constraint: IAuthorizationPolicyConstraint;
};

export type IAuthorizationPolicyAttachedConstraintEveryone = IAuthorizationPolicyAttachedConstraintBase & {
  kind: IAuthorizationPolicyAttachedConstraintKind.EVERYONE;
};

export type IAuthorizationPolicyAttachedConstraintAuthedUsuario = IAuthorizationPolicyAttachedConstraintBase & {
  kind: IAuthorizationPolicyAttachedConstraintKind.AUTHED_USUARIO;
};

export type IAuthorizationPolicyAttachedConstraintRoles = IAuthorizationPolicyAttachedConstraintBase & {
  kind: IAuthorizationPolicyAttachedConstraintKind.ROLES;

  roles: string[];
};

export type IAuthorizationPolicyAttachedConstraint =
  | IAuthorizationPolicyAttachedConstraintEveryone
  | IAuthorizationPolicyAttachedConstraintAuthedUsuario
  | IAuthorizationPolicyAttachedConstraintRoles;
