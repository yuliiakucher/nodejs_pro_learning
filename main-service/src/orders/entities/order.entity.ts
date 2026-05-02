import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { OrderItemEntity } from './order_item.entity';
import { BaseEntity } from '../../common/base.entity';
import { OrderStatusEntity } from './order_status.entity';
import { ProcessedMessagesEntity } from '../../rabbitmq/entities/processed_messages.entity';

@Entity('orders')
export class OrderEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    name: 'user_id',
  })
  userId: string;
  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    name: 'delivery_address',
    type: 'varchar',
    length: 255,
  })
  deliveryAddress: string;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  orderItems: OrderItemEntity[];

  @Column({
    name: 'idempotency_key',
    type: 'uuid',
    unique: true,
  })
  idempotencyKey: string;

  @Column({
    type: 'uuid',
    name: 'order_status_id',
    nullable: true,
  })
  statusId: string;
  @ManyToOne(() => OrderStatusEntity, (orderStatus) => orderStatus.orders)
  @JoinColumn({ name: 'order_status_id' })
  orderStatus: OrderStatusEntity;

  @Column({
    type: 'timestamp with time zone',
    name: 'processed_at',
    nullable: true, // for testing purpose
  })
  processedAt: string;

  @OneToMany(
    () => ProcessedMessagesEntity,
    (processedMessages) => processedMessages.order,
  )
  messages: ProcessedMessagesEntity[];
}
