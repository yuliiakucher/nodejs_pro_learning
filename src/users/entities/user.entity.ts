import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { OrderEntity } from '../../orders/entities/order.entity';
import { BaseEntity } from '../../common/base.entity';
import { RoleEntity } from './roles.entity';

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

  @Column({
    type: 'varchar',
    name: 'password_hash',
    default: 'temp_password',
  })
  passwordHash: string;

  @Column({
    type: 'varchar',
    name: 'refresh_token_hash',
    nullable: true,
  })
  refreshTokenHash: string;

  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable()
  roles: RoleEntity[];
}
