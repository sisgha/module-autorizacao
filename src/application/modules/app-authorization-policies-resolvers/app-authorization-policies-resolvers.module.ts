import { Module } from '@nestjs/common';
import { AppAuthorizationPoliciesResolversService } from './app-authorization-policies-resolvers.service';

@Module({
  imports: [
    //
  ],
  exports: [
    //
    AppAuthorizationPoliciesResolversService,
  ],
  providers: [
    //
    AppAuthorizationPoliciesResolversService,
  ],
})
export class AppAuthorizationPoliciesResolversModule {}
