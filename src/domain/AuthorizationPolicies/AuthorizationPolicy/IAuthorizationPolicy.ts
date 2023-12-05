import { IAuthorizationPolicyBuildContext } from './IAuthorizationPolicyBuildContext';

export interface IAuthorizationPolicy {
  priority: number;

  description: string;

  build(ctx: IAuthorizationPolicyBuildContext): void | Promise<void>;
}
