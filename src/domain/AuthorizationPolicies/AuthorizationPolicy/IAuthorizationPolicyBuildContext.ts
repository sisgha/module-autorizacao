import { IAuthorizationPolicyConstraint } from '../AuthorizationPolicyConstraint/IAuthorizationPolicyConstraint';

export interface IAuthorizationPolicyBuildContext {
  apply(constraint: IAuthorizationPolicyConstraint): IAuthorizationPolicyBuildContextApply;
}

export interface IAuthorizationPolicyBuildContextApply {
  for_roles(roles: string[] | string): void;

  for_authed_usuario(): void;

  for_everyone(): void;
}
