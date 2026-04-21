import { BaseEntity } from '../../common/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

export enum Status {
  PENDING = 'pending',
  READY = 'ready',
}

export enum Visibility {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

@Entity('file_records')
export class FileRecordEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.files)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    type: 'varchar',
  })
  key: string;

  @Column({
    type: 'varchar',
    name: 'content_type',
  })
  contentType: string;

  @Column({
    type: 'int',
  })
  size: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: string;

  @Column({
    type: 'enum',
    enum: Visibility,
    default: Visibility.PRIVATE,
  })
  visibility: string;
}
