import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable, timeout } from 'rxjs';
import { ConfigService } from '@nestjs/config';

export interface AuthorizeRequest {
  orderId: string;
  price: number;
  currency: string;
}

export interface AuthorizeResponse {
  paymentId: string;
  status: string;
}

export interface GetPaymentStatusRequest {
  paymentId: string;
}

export interface GetPaymentStatusResponse {
  paymentId: string;
  status: string;
}

interface PaymentsGrpcService {
  Authorize(payload: AuthorizeRequest): Observable<AuthorizeResponse>;

  GetPaymentStatus(
    payload: GetPaymentStatusRequest,
  ): Observable<GetPaymentStatusResponse>;
}

@Injectable()
export class PaymentsService implements OnModuleInit {
  private paymentsGrpcService!: PaymentsGrpcService;
  private timeoutMs: number;

  constructor(
    @Inject('PAYMENTS_PACKAGE') private readonly client: ClientGrpc,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit(): any {
    this.paymentsGrpcService =
      this.client.getService<PaymentsGrpcService>('Payments');

    this.timeoutMs = Number(
      this.configService.get<string>('PAYMENTS_GRPC_TIMEOUT_MS') ?? '5000',
    );
  }

  async authorize(payload: AuthorizeRequest): Promise<AuthorizeResponse> {
    try {
      const result = await firstValueFrom(
        this.paymentsGrpcService
          .Authorize(payload)
          .pipe(timeout(this.timeoutMs)),
      );
      console.log(
        `authorize ok orderId=${payload.orderId} paymentId=${result.paymentId}`,
      );
      return result;
    } catch (error) {
      console.error(`authorize failed orderId=${payload.orderId}`);
      throw error;
    }
  }

  async getPaymentStatus(paymentId: string) {
    return firstValueFrom(
      this.paymentsGrpcService
        .GetPaymentStatus({ paymentId })
        .pipe(timeout(this.timeoutMs)),
    );
  }
}
