import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { OrderEntity } from '../../orders/entities/order.entity';

@Entity('processed_messages')
export class ProcessedMessagesEntity extends BaseEntity {
  @Column({
    name: 'message_id',
    unique: true,
    type: 'uuid',
  })
  messageId: string;

  @Column({
    name: 'processed_at',
    type: 'timestamp with time zone',
  })
  processedAt: string;

  @ManyToOne(() => OrderEntity, (order) => order.messages)
  order: OrderEntity;

  @Column({
    nullable: true,
  })
  handler: string;
}
