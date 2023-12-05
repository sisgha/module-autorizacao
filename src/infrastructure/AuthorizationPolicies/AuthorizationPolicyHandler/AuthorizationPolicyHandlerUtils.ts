import { castArray } from 'lodash';
import { IAuthorizationPolicy, IAuthorizationPolicyAttachedConstraint, IAuthorizationPolicyAttachedConstraintKind } from '../../../domain';
import { IAuthorizationPolicyConstraint } from '../../../domain/AuthorizationPolicies/AuthorizationPolicyConstraint';

export const createAttachedConstraintForEveryone = (
  authorizationPolicy: IAuthorizationPolicy,
  constraint: IAuthorizationPolicyConstraint,
): IAuthorizationPolicyAttachedConstraint => {
  return <IAuthorizationPolicyAttachedConstraint>{
    policy: authorizationPolicy,
    kind: IAuthorizationPolicyAttachedConstraintKind.EVERYONE,
    constraint,
  };
};

export const createAttachedConstraintForRoles = (
  authorizationPolicy: IAuthorizationPolicy,
  constraint: IAuthorizationPolicyConstraint,
  roles: string | string[],
): IAuthorizationPolicyAttachedConstraint => {
  return <IAuthorizationPolicyAttachedConstraint>{
    policy: authorizationPolicy,
    kind: IAuthorizationPolicyAttachedConstraintKind.ROLES,
    roles: castArray(roles),
    constraint,
  };
};

export const createAttachedConstraintForAuthedUsuario = (
  authorizationPolicy: IAuthorizationPolicy,
  constraint: IAuthorizationPolicyConstraint,
): IAuthorizationPolicyAttachedConstraint => {
  return <IAuthorizationPolicyAttachedConstraint>{
    policy: authorizationPolicy,
    kind: IAuthorizationPolicyAttachedConstraintKind.AUTHED_USUARIO,
    constraint,
  };
};
