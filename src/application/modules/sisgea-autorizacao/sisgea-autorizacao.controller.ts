import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AllowedResourceResponse, CanResponse, GenericCanRequest, UsuarioCanRequest } from '@sisgea/autorizacao-client';
import { Observable, from } from 'rxjs';
import { SisgeaAutorizacaoService } from './sisgea-autorizacao.service';

@Controller()
export class SisgeaAutorizacaoController {
  constructor(
    //
    private sisgeaAutorizacaoService: SisgeaAutorizacaoService,
  ) {}

  @GrpcMethod('CheckService', 'AnonymousCan')
  async anonymousCan(data: GenericCanRequest): Promise<CanResponse> {
    return this.sisgeaAutorizacaoService.anonymousCan(data);
  }

  @GrpcMethod('CheckService', 'AnonymousAllowedResources')
  async anonymousAllowedResources(data: GenericCanRequest): Promise<Observable<AllowedResourceResponse>> {
    return from(this.sisgeaAutorizacaoService.anonymousAllowedResources(data));
  }

  //

  @GrpcMethod('CheckService', 'InternalSystemCan')
  async internalSystemCan(data: GenericCanRequest): Promise<CanResponse> {
    return this.sisgeaAutorizacaoService.internalSystemCan(data);
  }

  @GrpcMethod('CheckService', 'InternalSystemAllowedResources')
  async internalSystemAllowedResources(data: GenericCanRequest): Promise<Observable<AllowedResourceResponse>> {
    return from(this.sisgeaAutorizacaoService.internalSystemAllowedResources(data));
  }

  //

  @GrpcMethod('CheckService', 'UsuarioCan')
  async usuarioCan(data: UsuarioCanRequest): Promise<CanResponse> {
    return this.sisgeaAutorizacaoService.usuarioCan(data);
  }

  @GrpcMethod('CheckService', 'UsuarioAllowedResources')
  async usuarioAllowedResources(data: UsuarioCanRequest): Promise<Observable<AllowedResourceResponse>> {
    return from(this.sisgeaAutorizacaoService.usuarioAllowedResources(data));
  }
}
