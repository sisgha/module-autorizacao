import { IAuthorizationPolicyConstraintAttachedStatement } from '../../../domain';
import { checkIfConditionNeedsDatabaseResolution } from '../AuthorizationPolicyCondition';

export const checkIfAttachedStatementNeedsDatabaseResolution = (attachedStatement: IAuthorizationPolicyConstraintAttachedStatement) => {
  if (attachedStatement.inner_joins.length > 0) {
    return true;
  }

  if (checkIfConditionNeedsDatabaseResolution(attachedStatement.where)) {
    return true;
  }

  return false;
};
