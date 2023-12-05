import { z } from 'zod';
import { AuthorizationPolicyConditionZod } from './AuthorizationPolicyConditionZod';

export const AuthorizationPolicyConstraintAttachedStatementInnerJoinZod = z.object({
  b_resource: z.string(),
  b_alias: z.string(),
  onCondition: AuthorizationPolicyConditionZod,
});
