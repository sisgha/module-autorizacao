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
export const extractAliasesMappingsFromMixedStatement = (mixedStatement: IAuthorizationPolicyMixedStatement, resource: string) => {
  const aliasesMappings: Map<string, string> = new Map<string, string>();

  aliasesMappings.set(mixedStatement.alias, resource);

  for (const inner_join of mixedStatement.inner_joins) {
    aliasesMappings.set(inner_join.b_alias, inner_join.b_resource);
  }

  return aliasesMappings;
};
