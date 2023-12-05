import { IAuthorizationPolicyConstraintConstructContext } from './IAuthorizationPolicyConstraintConstructContext';

export interface IAuthorizationPolicyConstraint {
  description: string;

  construct(ctx: IAuthorizationPolicyConstraintConstructContext): void | Promise<void>;
}
