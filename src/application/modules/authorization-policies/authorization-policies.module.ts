import { Module } from '@nestjs/common';
import { AuthorizationPoliciesService } from './authorization-policies.service';

@Module({
  imports: [],
  exports: [
    //
    AuthorizationPoliciesService,
  ],
  controllers: [],
  providers: [
    //
    AuthorizationPoliciesService,
  ],
})
export class AuthorizationPoliciesModules {}
