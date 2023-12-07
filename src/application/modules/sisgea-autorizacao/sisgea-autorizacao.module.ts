import { Module } from '@nestjs/common';
import { AuthorizationPoliciesModules } from '../app-authorization-policies-runner/app-authorization-policies-runner.module';
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
