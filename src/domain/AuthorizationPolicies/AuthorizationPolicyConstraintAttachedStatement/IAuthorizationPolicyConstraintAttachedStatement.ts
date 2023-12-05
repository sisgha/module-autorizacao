import { IAuthorizationPolicyCondition } from '../AuthorizationPolicyCondition';
import {
  IAuthorizationPolicyConstraintStatementBuilderSpecialAction,
  IAuthorizationPolicyConstraintStatementBuilderSpecialTarget,
} from '../AuthorizationPolicyConstraintStatementBuilder';
import { IAuthorizationPolicyConstraintAttachedStatementBehaviour } from './IAuthorizationPolicyConstraintAttachedStatementBehaviour';
import { IAuthorizationPolicyConstraintAttachedStatementInnerJoin } from './IAuthorizationPolicyConstraintAttachedStatementInnerJoin';

export type IAuthorizationPolicyConstraintAttachedStatement = {
  behaviour: IAuthorizationPolicyConstraintAttachedStatementBehaviour;

  //

  alias: string | null;

  action: IAuthorizationPolicyConstraintStatementBuilderSpecialAction.MANAGE | string[];
  target: IAuthorizationPolicyConstraintStatementBuilderSpecialTarget.ALL | string[];

  where: IAuthorizationPolicyCondition | null;

  inner_joins: IAuthorizationPolicyConstraintAttachedStatementInnerJoin[];
};
