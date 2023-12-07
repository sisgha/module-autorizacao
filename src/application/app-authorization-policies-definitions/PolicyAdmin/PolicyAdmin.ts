import { IAuthorizationPolicy } from '@sisgea/authorization-policies-core';
import { PolicyAdminConstraint } from './PolicyAdminConstraint';

export const PolicyAdmin: IAuthorizationPolicy = {
  priority: 600,

  description: 'Administrador do sistema.',

  build(ctx) {
    ctx.apply(PolicyAdminConstraint).for_roles('admin');
  },
};
