import { Injectable } from '@nestjs/common';
import {
  AuthorizationPoliciesManager,
  AuthorizationPolicyAttachedConstraintsHandler,
  AuthorizationPolicyConstraintAttachedStatementMixer,
  IAuthorizationPolicyConstraintStatementBuilderSpecialAction,
  IAuthorizationPolicyConstraintStatementBuilderSpecialTarget,
} from '@sisgea/authorization-policies-core';
import { AllPolicies } from '../../app-authorization-policies-definitions/AllPolicies';
import { ITargetActor } from '../../../domain';
import { IFilterAttachedConstraintsForTargetActorDependencies } from '../../../infrastructure/AuthorizationPolicies/interfaces/IAuthorizationPolicyAttachedConstraintsUtils';
import { filterAttachedConstraintsForTargetActor } from '../../../infrastructure/AuthorizationPolicies/AuthorizationPolicyAttachedConstraintsUtils';

@Injectable()
export class AppAuthorizationPoliciesRepositoryService {
  constructor() {}

  private *getAllAppAuthorizationPolicies() {
    yield* AllPolicies;
  }

  private async getAuthorizationPoliciesManager() {
    const authorizationPoliciesManager = new AuthorizationPoliciesManager();
    await authorizationPoliciesManager.addPolicies(this.getAllAppAuthorizationPolicies());
    return authorizationPoliciesManager;
  }

  async *getAllAttachedConstraints() {
    const authorizationPoliciesManager = await this.getAuthorizationPoliciesManager();
    yield* authorizationPoliciesManager.buildAttachedConstraints();
  }

  //

  async *getAttachedConstraintsForTargetActor(targetActor: ITargetActor, deps: IFilterAttachedConstraintsForTargetActorDependencies) {
    const allAttachedConstraintsIterable = this.getAllAttachedConstraints();
    yield* filterAttachedConstraintsForTargetActor(allAttachedConstraintsIterable, targetActor, deps);
  }

  async *getMatchedAttachedStatements(
    targetActor: ITargetActor,
    action: string,
    resource: string,
    deps: IFilterAttachedConstraintsForTargetActorDependencies,
  ) {
    const attachedConstraintsForTargetActor = this.getAttachedConstraintsForTargetActor(targetActor, deps);

    const attachedStatements = AuthorizationPolicyAttachedConstraintsHandler.buildAttachedStatements(
      attachedConstraintsForTargetActor,
      targetActor,
    );

    for await (const attachedStatement of attachedStatements) {
      const actionMatch =
        attachedStatement.action === IAuthorizationPolicyConstraintStatementBuilderSpecialAction.MANAGE ||
        attachedStatement.action.includes(action);

      const targetMatch =
        attachedStatement.target === IAuthorizationPolicyConstraintStatementBuilderSpecialTarget.ALL ||
        attachedStatement.target.includes(resource);

      if (actionMatch && targetMatch) {
        yield attachedStatement;
      }
    }
  }

  async buildMixedStatement(
    targetActor: ITargetActor,
    action: string,
    resource: string,
    deps: IFilterAttachedConstraintsForTargetActorDependencies,
  ) {
    const matchedAttachedStatements = this.getMatchedAttachedStatements(targetActor, action, resource, deps);

    const mixer = new AuthorizationPolicyConstraintAttachedStatementMixer();
    await mixer.addAttachedStatements(matchedAttachedStatements);

    return mixer.state;
  }
}
