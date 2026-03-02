import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { OrderItemEntity } from './order_item.entity';
import { BaseEntity } from '../../common/base.entity';

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
}
