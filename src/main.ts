import { ServerCredentials } from '@grpc/grpc-js';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const url = process.env.URL ?? 'localhost:3013';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,

    options: {
      package: 'sisgea.autorizacao',
      protoPath: require.resolve('@sisgea/autorizacao-client/proto/sisgea.autorizacao.proto'),
      url: url,
      credentials: ServerCredentials.createInsecure(),
    },
  });

  await app.listen();
}
bootstrap();
