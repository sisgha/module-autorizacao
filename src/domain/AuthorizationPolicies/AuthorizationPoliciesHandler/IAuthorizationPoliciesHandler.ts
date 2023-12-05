import { AnyIterable, IAuthorizationPoliciesIterable, IAuthorizationPolicy, IAuthorizationPolicyAttachedConstraint } from '../../../domain';

export interface IAuthorizationPoliciesHandler {
  addPolicy(policy: IAuthorizationPolicy): Promise<void>;

  addPolicies(policies: IAuthorizationPoliciesIterable): Promise<void>;

  getOrderedPolicies(): IAuthorizationPoliciesIterable;

  buildAttachedConstraints(): AnyIterable<IAuthorizationPolicyAttachedConstraint>;
}
