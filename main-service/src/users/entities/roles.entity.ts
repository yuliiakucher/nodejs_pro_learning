import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { UserEntity } from './user.entity';

@Entity('roles')
export class RoleEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 255,
    name: 'claim_name',
  })
  claimName: string;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];
}
