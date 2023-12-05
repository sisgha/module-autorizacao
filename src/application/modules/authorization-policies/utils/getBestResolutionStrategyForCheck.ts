import { IAuthorizationPolicyMixedStatement } from '../../../../domain';

export const getBestResolutionStrategyForCheck = (
  action: string,
  resource: string,
  resourceId: string | null,
  mixedStatement: IAuthorizationPolicyMixedStatement,
) => {
  if (resourceId === null && mixedStatement.where.kind === 'boolean' && mixedStatement.inner_joins.length === 0) {
    return 'casl';
  }

  return 'database';
};
