import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'node:path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'payments',
        protoPath: join(process.cwd(), 'proto/payments.proto'),
        url: '0.0.0.0:50051',
      },
    },
  );
  await app.listen();
  console.log('Payment gRPC service running on port 50051');
}

void bootstrap();
