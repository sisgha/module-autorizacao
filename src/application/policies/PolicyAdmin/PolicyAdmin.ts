import { IAuthorizationPolicy } from '../../../domain';
import { PolicyAdminConstraint } from './PolicyAdminConstraint';

export const PolicyAdmin: IAuthorizationPolicy = {
  priority: 600,

  description: 'Administrador do sistema.',

  build(ctx) {
    ctx.apply(PolicyAdminConstraint).for_roles('admin');
  },
};
