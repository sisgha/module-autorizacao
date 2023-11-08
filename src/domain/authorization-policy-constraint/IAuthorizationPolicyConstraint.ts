import { IAuthorizationPolicyConstraintContext } from './IAuthorizationPolicyConstraintContext';

export interface IAuthorizationPolicyConstraint {
  description: string;

  construct(ctx: IAuthorizationPolicyConstraintContext): void;
}
