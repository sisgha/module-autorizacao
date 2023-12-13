import { Module } from '@nestjs/common';
import { AppAuthorizationPoliciesRunnerService } from './app-authorization-policies-runner.service';
import { AppAuthorizationPoliciesRepositoryModule } from '../app-authorization-policies-repository/app-authorization-policies-repository.module';
import { AppAuthorizationPoliciesResolversModule } from '../app-authorization-policies-resolvers/app-authorization-policies-resolvers.module';

@Module({
  imports: [
    //
    AppAuthorizationPoliciesRepositoryModule,
    AppAuthorizationPoliciesResolversModule,
  ],
  exports: [
    //
    AppAuthorizationPoliciesRunnerService,
  ],
  controllers: [],
  providers: [
    //
    AppAuthorizationPoliciesRunnerService,
  ],
})
export class AuthorizationPoliciesModules {}
