import { Column, Entity, OneToMany } from 'typeorm';
import { OrderEntity } from '../../orders/entities/order.entity';
import { BaseEntity } from '../../common/base.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 255,
  })
  email: string;

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];
}
