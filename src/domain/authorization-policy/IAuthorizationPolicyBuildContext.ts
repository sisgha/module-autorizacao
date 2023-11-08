import { IAuthorizationPolicyConstraint } from '../authorization-policy-constraint';
import { ITargetActor } from '../sisgea/ITargetActor';

export interface IAuthorizationPolicyBuildContextApply {
  for_roles(roles: string[] | string): void;
  for_authed_usuario(): void;
  for_everyone(): void;
}

export interface IAuthorizationPolicyBuildContext {
  targetActor: ITargetActor;

  apply(constraint: IAuthorizationPolicyConstraint): IAuthorizationPolicyBuildContextApply;
}
