import { IResolutionResolver } from './IResolutionResolver';
import { IAuthorizationPolicyMixedStatement } from '@sisgea/authorization-policies-core';

export type IResolution<Resolver = IResolutionResolver> = {
  resolver: Resolver;
  mixedStatement: IAuthorizationPolicyMixedStatement;
};
