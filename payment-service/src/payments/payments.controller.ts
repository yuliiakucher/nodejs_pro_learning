import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @GrpcMethod('Payments', 'Authorize')
  authorize(data: { orderId: string; price: number; currency: string }) {
    return this.paymentsService.authorize(data);
  }

  @GrpcMethod('Payments', 'GetPaymentStatus')
  getPaymentStatus(data: { paymentId: string }) {
    return this.paymentsService.getPaymentStatus(data);
  }
}
