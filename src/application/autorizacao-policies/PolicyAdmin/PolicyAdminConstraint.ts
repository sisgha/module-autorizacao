import {
  IAuthorizationPolicyConstraint,
  IAuthorizationPolicyConstraintStatementBuilderSpecialAction,
  IAuthorizationPolicyConstraintStatementBuilderSpecialTarget,
} from '@sisgea/authorization-policies-core';

export const PolicyAdminConstraint: IAuthorizationPolicyConstraint = {
  description: 'Constraint que permite a realização de qualquer ação no sistema.',

  construct(ctx) {
    ctx
      .statement()
      .alias('row')
      .action(IAuthorizationPolicyConstraintStatementBuilderSpecialAction.MANAGE)
      .target(IAuthorizationPolicyConstraintStatementBuilderSpecialTarget.ALL)
      .where(true)
      .approve();
  },
};
