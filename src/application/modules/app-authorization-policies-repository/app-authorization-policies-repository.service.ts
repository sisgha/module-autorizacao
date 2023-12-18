import { Injectable } from '@nestjs/common';
import {
  AuthorizationPoliciesManager,
  AuthorizationPolicyAttachedConstraintsHandler,
  AuthorizationPolicyConstraintAttachedStatementMixer,
  IAuthorizationPolicyAttachedConstraint,
  IAuthorizationPolicyConstraintStatementBuilderSpecialAction,
  IAuthorizationPolicyConstraintStatementBuilderSpecialTarget,
} from '@sisgea/authorization-policies-core';
import { ITargetActor } from '../../../domain';
import { filterAttachedConstraintsForTargetActor } from '../../../infrastructure/authorization-policies/AuthorizationPolicyAttachedConstraintsUtils';
import { IFilterAttachedConstraintsForTargetActorDependencies } from '../../../infrastructure/authorization-policies/domain/IAuthorizationPolicyAttachedConstraintsUtils';
import { AllPolicies } from '../../autorizacao-policies/AllPolicies';

@Injectable()
export class AppAuthorizationPoliciesRepositoryService {
  constructor() {}

  async *getAllAttachedConstraints() {
    const authorizationPoliciesManager = await this.getAuthorizationPoliciesManager();
    yield* authorizationPoliciesManager.buildAttachedConstraints();
  }

  async *getAttachedConstraintsForTargetActor(
    targetActor: ITargetActor,
    deps: IFilterAttachedConstraintsForTargetActorDependencies,
  ): AsyncIterable<IAuthorizationPolicyAttachedConstraint<ITargetActor>> {
    const allAttachedConstraintsIterable = this.getAllAttachedConstraints();

    yield* filterAttachedConstraintsForTargetActor<ITargetActor>(allAttachedConstraintsIterable, targetActor, deps);
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

  //

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

  private *getAllAppAuthorizationPolicies() {
    yield* AllPolicies;
  }

  private async getAuthorizationPoliciesManager() {
    const authorizationPoliciesManager = new AuthorizationPoliciesManager<ITargetActor>();
    await authorizationPoliciesManager.addPolicies(this.getAllAppAuthorizationPolicies());
    return authorizationPoliciesManager;
  }
}
