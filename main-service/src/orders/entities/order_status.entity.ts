import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { OrderEntity } from './order.entity';

@Entity('order_status')
export class OrderStatusEntity extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => OrderEntity, (order) => order.orderStatus)
  orders: OrderEntity[];
}
