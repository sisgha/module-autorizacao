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
    mixedStatement.where.type === IAuthorizationPolicyConditionType.VALUE_BOOLEAN &&
    mixedStatement.inner_joins.length === 0
  ) {
    return IResolutionResolverStrategy.CASL;
  }

  return IResolutionResolverStrategy.DATABASE;
};
