import { IAuthorizationPolicyConstraintStatementBuilderSpecialAction } from '../../../domain';
import { IAuthorizationPolicyConstraint } from '../../../domain/AuthorizationPolicies/AuthorizationPolicyConstraint';
import { Builder } from '../../../infrastructure/AuthorizationPolicies/AuthorizationPolicyCondition';
import { AppResourceUsuario } from '../../../infrastructure/app-resources';

export const PolicyAdminConstraint: IAuthorizationPolicyConstraint = {
  description: 'Constraint que permite a realização de qualquer ação no sistema.',

  construct(ctx) {
    ctx
      .statement()
      .alias('usuario')
      .action(IAuthorizationPolicyConstraintStatementBuilderSpecialAction.MANAGE)
      .target(AppResourceUsuario.resource)
      .where(Builder.NEq(Builder.ResourceAttribute('usuario', 'matricula_siape'), Builder.Literal('sisgea-admin')))
      .approve();
  },
};
