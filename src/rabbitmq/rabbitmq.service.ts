import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type { Channel, ChannelModel, ConsumeMessage } from 'amqplib';
import * as amqp from 'amqplib';
import { ConfigService } from '@nestjs/config';

export const MAIN_QUEUE = 'orders.process';
export const EXCHANGE_DLX = 'dlx';
export const DLQ_QUEUE = 'orders.dlq';
export const DLQ_ROUTING_KEY = 'dead_letter';
export const RETRY_ROUTING_KEY = 'retry';
const RETRY_QUEUE = 'orders.retry';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private channel: Channel;
  private connection: ChannelModel;

  private readonly url: string;

  constructor(private readonly configService: ConfigService) {
    this.url = configService.getOrThrow<string>('RABBITMQ_URL');
  }

  async onModuleInit() {
    while (true) {
      try {
        this.connection = await amqp.connect(`amqp://${this.url}`);
        this.channel = await this.connection.createChannel();

        console.log('Connected');
        break;
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.error('[Error while connecting:]', err.message);
        await new Promise((r) => setTimeout(r, 5000));
      }
    }

    // Declaring the Dead Letter Exchange(DLX)
    await this.channel.assertExchange(EXCHANGE_DLX, 'direct', {
      durable: true,
    });

    // orders queue -> retry queue
    await this.channel.assertQueue(MAIN_QUEUE, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': EXCHANGE_DLX,
        'x-dead-letter-routing-key': RETRY_ROUTING_KEY,
      },
    });

    // retry queue -> main queue
    await this.channel.assertQueue(RETRY_QUEUE, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': MAIN_QUEUE,
        'x-message-ttl': 5000, // 5 seconds delay
      },
    });

    // Declaring the Dead Letter Queue(DLQ) (after retries)
    await this.channel.assertQueue(DLQ_QUEUE, {
      durable: true,
    });

    // ----binding
    //binding dlq queue to dlx
    await this.channel.bindQueue(DLQ_QUEUE, EXCHANGE_DLX, DLQ_ROUTING_KEY);

    //binding retry queue to dlx
    await this.channel.bindQueue(RETRY_QUEUE, EXCHANGE_DLX, RETRY_ROUTING_KEY);
  }

  sendMessage(queue: string, message: string): void {
    this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async receiveMessage(
    handler: (msg: ConsumeMessage, channel: Channel) => void,
  ): Promise<void> {
    let message: ConsumeMessage | null = null;

    await this.channel.consume(
      MAIN_QUEUE,
      (msg: ConsumeMessage) => {
        message = msg;
        handler(message, this.channel);
      },
      { noAck: false },
    );
  }

  async consumeDLQ(): Promise<void> {
    await this.channel.consume(DLQ_QUEUE, (msg: ConsumeMessage) => {
      console.log('in consumeDLQ');
      console.log(msg);
      if (msg) {
        const xDeathHeader = msg?.properties?.headers?.['x-death'];
        if (xDeathHeader) {
          console.warn('[Dead-letter reason]', xDeathHeader[0].reason);
          console.warn('[Orig exchange]', xDeathHeader[0].exchange);
          console.warn('[Orig routing key]', xDeathHeader[0]['routing-keys']);
        }
        this.channel.ack(msg);
      }
    });
  }

  async onModuleDestroy() {
    await this.connection.close();
  }
}
