import { Module } from '@nestjs/common';
import { AuthorizationPoliciesModules } from '../authorization-policies/authorization-policies.module';
import { AutorizacaoController } from './autorizacao.controller';
import { AutorizacaoService } from './autorizacao.service';

@Module({
  imports: [
    //
    AuthorizationPoliciesModules,
  ],

  providers: [
    //
    AutorizacaoController,
    AutorizacaoService,
  ],
  controllers: [
    //
    AutorizacaoController,
  ],
  exports: [
    //
    AutorizacaoService,
  ],
})
export class AutorizacaoModule {}
