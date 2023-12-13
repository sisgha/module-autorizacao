import { Module } from '@nestjs/common';
import { AppAuthorizationPoliciesRepositoryService } from './app-authorization-policies-repository.service';

@Module({
  imports: [],
  exports: [
    //
    AppAuthorizationPoliciesRepositoryService,
  ],
  providers: [
    //
    AppAuthorizationPoliciesRepositoryService,
  ],
})
export class AppAuthorizationPoliciesRepositoryModule {}
