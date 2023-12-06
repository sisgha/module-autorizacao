import { Module } from '@nestjs/common';
import { AuthorizationPoliciesModules } from '../authorization-policies/authorization-policies.module';
import { SisgeaAutorizacaoController } from './sisgea-autorizacao.controller';
import { SisgeaAutorizacaoService } from './sisgea-autorizacao.service';

@Module({
  imports: [
    //
    AuthorizationPoliciesModules,
  ],

  providers: [
    //
    SisgeaAutorizacaoController,
    SisgeaAutorizacaoService,
  ],
  controllers: [
    //
    SisgeaAutorizacaoController,
  ],
  exports: [
    //
    SisgeaAutorizacaoService,
  ],
})
export class SisgeaAutorizacaoModule {}
