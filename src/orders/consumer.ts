import { Inject, OnApplicationBootstrap } from '@nestjs/common';
import {
  DLQ_ROUTING_KEY,
  EXCHANGE_DLX,
  RabbitmqService,
  RETRY_ROUTING_KEY,
} from '../rabbitmq/rabbitmq.service';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { IRabbitMqMessage } from './orders.service';
import { Channel, type ConsumeMessage } from 'amqplib';
import { OrderStatusEntity } from './entities/order_status.entity';
import { ProcessedMessagesEntity } from '../rabbitmq/entities/processed_messages.entity';

export class Consumer implements OnApplicationBootstrap {
  constructor(
    @Inject() private readonly rabbitmqService: RabbitmqService,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderStatusEntity)
    private readonly orderStatusRepository: Repository<OrderStatusEntity>,
    @InjectRepository(ProcessedMessagesEntity)
    private readonly processedMessagesRepository: Repository<ProcessedMessagesEntity>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.rabbitmqService.receiveMessage((msg, channel) =>
      this.messageHandler(msg, channel),
    );

    await this.rabbitmqService.consumeDLQ();
  }

  async messageHandler(msg: ConsumeMessage, channel: Channel): Promise<void> {
    try {
      const message = JSON.parse(msg.content.toString()) as IRabbitMqMessage;

      console.log('TEST CONSUMER RECEIVED:', message);
      // simulate business logic
      await new Promise((r) => setTimeout(r, 1000 * 6));
      console.log('Business logic processing finished');

      const status = await this.orderStatusRepository.findOne({
        where: {
          name: 'PROCESSED', // TODO: use enums
        },
      });

      if (!status) {
        throw new Error('Unable to get order status');
      }

      const processedTime = new Date().toISOString();

      const order = await this.orderRepository.findOne({
        where: {
          id: message.orderId,
        },
      });

      if (!order) {
        throw new Error('Unable to get order');
      }

      await this.orderRepository.update(
        {
          id: message.orderId,
        },
        {
          orderStatus: status,
          processedAt: processedTime,
        },
      );

      try {
        const processedMessage = this.processedMessagesRepository.create({
          messageId: message.messageId,
          processedAt: processedTime,
          order,
        });

        await this.processedMessagesRepository.save(processedMessage);
      } catch (error) {
        if (error.code === '23505') {
          console.warn('Message already processed:', message.messageId);
          channel.ack(msg);
          return;
        }

        throw error; // rethrow other errors
      }

      channel.ack(msg);
    } catch (err) {
      const retries = msg?.properties?.headers?.['x-retries'] as number;
      const nextRetry: number = (retries || 0) + 1;
      if (nextRetry && Number.isInteger(nextRetry) && nextRetry < 3) {
        channel.publish(EXCHANGE_DLX, RETRY_ROUTING_KEY, msg.content, {
          headers: {
            'x-retries': nextRetry,
          },
        });
        channel.ack(msg);
      } else {
        channel.publish(EXCHANGE_DLX, DLQ_ROUTING_KEY, msg.content);
      }
    }
  }
}
