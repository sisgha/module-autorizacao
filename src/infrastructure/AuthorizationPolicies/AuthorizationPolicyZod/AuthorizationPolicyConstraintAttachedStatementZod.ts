import { z } from 'zod';
import {
  IAuthorizationPolicyConstraintAttachedStatementBehaviour,
  IAuthorizationPolicyConstraintStatementBuilderSpecialAction,
  IAuthorizationPolicyConstraintStatementBuilderSpecialTarget,
} from '../../../domain';
import { AuthorizationPolicyConditionZod } from './AuthorizationPolicyConditionZod';
import { AuthorizationPolicyConstraintAttachedStatementInnerJoinZod } from './AuthorizationPolicyConstraintAttachedStatementInnerJoinZod';

export const AuthorizationPolicyConstraintAttachedStatementZod = z.object({
  behaviour: z.nativeEnum(IAuthorizationPolicyConstraintAttachedStatementBehaviour),

  alias: z.string().nullable(),

  action: z.union([
    //
    z.array(z.string()),
    z.literal(IAuthorizationPolicyConstraintStatementBuilderSpecialAction.MANAGE),
  ]),

  target: z.union([
    //
    z.array(z.string()),
    z.literal(IAuthorizationPolicyConstraintStatementBuilderSpecialTarget.ALL),
  ]),

  where: AuthorizationPolicyConditionZod,

  inner_joins: z.array(AuthorizationPolicyConstraintAttachedStatementInnerJoinZod),
});
