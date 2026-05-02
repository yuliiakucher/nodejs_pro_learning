import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'node:path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PAYMENTS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'payments',
          protoPath: join(process.cwd(), 'proto/payments.proto'),
          url: 'localhost:50051',
        },
      },
    ]),
    ConfigModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
