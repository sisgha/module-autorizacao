import { IAuthorizationPolicyCondition } from '../AuthorizationPolicyCondition';
import { IAuthorizationPolicyMixedStatementInnerJoin } from './IAuthorizationPolicyMixedStatementInnerJoin';

export type IAuthorizationPolicyMixedStatement = {
  alias: string;

  where: IAuthorizationPolicyCondition;

  inner_joins: IAuthorizationPolicyMixedStatementInnerJoin[];
};
