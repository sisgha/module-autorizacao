import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const url = process.env.URL ?? 'localhost:3013';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,

    options: {
      package: 'autorizacao',
      protoPath: join(__dirname, 'infrastructure/app/autorizacao/autorizacao.proto'),
      url: url,
    },
  });

  await app.listen();
}
bootstrap();
