import { Injectable } from '@nestjs/common';

export enum PaymentStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

interface PaymentRecord {
  paymentId: string;
  orderId: string;
  price: number;
  currency: string;
  status: PaymentStatus;
}

@Injectable()
export class PaymentsService {
  private readonly store = new Map<string, PaymentRecord>();

  authorize(data: { orderId: string; price: number; currency: string }) {
    // uncomment the following Promise to simulate slow payment processing
    // return new Promise((resolve) =>
    //   setTimeout(() => {
    //     resolve('success');
    //   }, 1000 * 20),
    // ); // 20 seconds - longer than our 5s timeout

    const { orderId, price, currency } = data;
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const status =
      Math.random() > 0.2 ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;

    this.store.set(paymentId, { paymentId, orderId, price, currency, status });

    return { paymentId, status };
  }

  getPaymentStatus(data: { paymentId: string }) {
    const { paymentId } = data;
    const record = this.store.get(paymentId);

    if (!record) {
      return { paymentId, status: 'NOT_FOUND' };
    }

    return { paymentId: record.paymentId, status: record.status };
  }
}
