import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { ProcessedMessagesEntity } from './entities/processed_messages.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessedMessagesEntity])],
  providers: [RabbitmqService],
})
export class RabbitmqModule {}
