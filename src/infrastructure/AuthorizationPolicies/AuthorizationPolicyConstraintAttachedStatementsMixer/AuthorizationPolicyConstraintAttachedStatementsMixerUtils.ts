import {
  IAuthorizationPolicyCondition,
  IAuthorizationPolicyConstraintAttachedStatementBehaviour,
  IAuthorizationPolicyMixedStatement,
} from '../../../domain';
import { Builder, checkIfConditionNeedsDatabaseResolution } from '../AuthorizationPolicyCondition';

export const attachBehaviourOnCondition = (
  previousCondition: IAuthorizationPolicyCondition | null,
  nextCondition: IAuthorizationPolicyCondition,
  behaviour: IAuthorizationPolicyConstraintAttachedStatementBehaviour,
): IAuthorizationPolicyCondition | null => {
  switch (behaviour) {
    case IAuthorizationPolicyConstraintAttachedStatementBehaviour.APPROVE: {
      return Builder.CombineOr(previousCondition, nextCondition);
    }

    case IAuthorizationPolicyConstraintAttachedStatementBehaviour.REJECT: {
      const invertedNextCondition = Builder.Not(nextCondition);

      return Builder.CombineAnd(previousCondition, invertedNextCondition);
    }
  }

  return null;
};

export const checkIfMixedStatementNeedsDatabaseResolution = (mixedStatement: IAuthorizationPolicyMixedStatement) => {
  if (mixedStatement.inner_joins.length > 0) {
    return true;
  }

  if (checkIfConditionNeedsDatabaseResolution(mixedStatement.where)) {
    return true;
  }

  return false;
};
