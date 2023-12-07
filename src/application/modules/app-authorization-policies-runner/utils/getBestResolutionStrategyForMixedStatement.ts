import { IAuthorizationPolicyConditionType, IAuthorizationPolicyMixedStatement } from '@sisgea/authorization-policies-core';

export const getBestResolutionStrategyForMixedStatement = (
  action: string,
  resource: string,
  resourceId: string | null,
  mixedStatement: IAuthorizationPolicyMixedStatement,
) => {
  if (
    resourceId === null &&
    mixedStatement.subStatementsMixed.length <= 1 &&
    mixedStatement.subStatementsMixed.every((subStatement) => subStatement.joins.length === 0) &&
    mixedStatement.subStatementsMixed.every((subStatement) => subStatement.where.type === IAuthorizationPolicyConditionType.VALUE_BOOLEAN)
  ) {
    return 'casl';
  }

  return 'database';
};
