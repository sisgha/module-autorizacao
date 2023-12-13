import { IAuthorizationPolicyConditionType, IAuthorizationPolicyMixedStatement } from '@sisgea/authorization-policies-core';
import { IResolutionResolverStrategy } from '../domain/IResolutionResolver';

export const getBestResolutionStrategyForMixedStatement = (
  action: string,
  resource: string,
  resourceId: string | null,
  mixedStatement: IAuthorizationPolicyMixedStatement,
) => {
  if (
    resourceId === null &&
    mixedStatement.subStatementsMixed.length <= 1 &&
    mixedStatement.subStatementsMixed.every((i) => i.where.type === IAuthorizationPolicyConditionType.VALUE_BOOLEAN) &&
    mixedStatement.subStatementsMixed.every((i) => i.joins.length === 0)
  ) {
    return IResolutionResolverStrategy.CASL;
  }

  return IResolutionResolverStrategy.DATABASE;
};
