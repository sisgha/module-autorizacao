import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UsuarioCanRequest, UsuarioCanResponse } from '@sisgea/autorizacao-client';
import { AutorizacaoService } from './autorizacao.service';

@Controller()
export class AutorizacaoController {
  constructor(
    //
    private autorizacaoService: AutorizacaoService,
  ) {}

  @GrpcMethod('CheckService', 'UsuarioCan')
  async usuarioCan(data: UsuarioCanRequest, _metadata: Metadata, _call: ServerUnaryCall<any, any>): Promise<UsuarioCanResponse> {
    return this.autorizacaoService.usuarioCan(data);
  }
}
