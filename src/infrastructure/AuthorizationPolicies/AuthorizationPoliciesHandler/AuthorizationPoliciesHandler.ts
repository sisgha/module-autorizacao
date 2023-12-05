import { IAuthorizationPoliciesHandler, IAuthorizationPoliciesIterable, IAuthorizationPolicy } from '../../../domain';
import { AuthorizationPolicyHandler } from '../AuthorizationPolicyHandler/AuthorizationPolicyHandler';

export class AuthorizationPoliciesHandler implements IAuthorizationPoliciesHandler {
  #attachedPolicies = new Set<IAuthorizationPolicy>();

  async addPolicy(policy: IAuthorizationPolicy) {
    this.#attachedPolicies.add(policy);
  }

  async addPolicies(policies: IAuthorizationPoliciesIterable) {
    for await (const policy of policies) {
      await this.addPolicy(policy);
    }
  }

  async *getOrderedPolicies() {
    yield* Array.from(this.#attachedPolicies).sort((a, b) => b.priority - a.priority);
  }

  async *buildAttachedConstraints() {
    for await (const policy of this.getOrderedPolicies()) {
      const attachedConstraints = await AuthorizationPolicyHandler.buildAttachedConstraints(policy);
      yield* attachedConstraints;
    }
  }
}
