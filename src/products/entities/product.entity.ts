import { Column, Entity, OneToMany, Index } from 'typeorm';
import { OrderItemEntity } from '../../orders/entities/order_item.entity';
import { BaseEntity } from '../../common/base.entity';

@Entity('products')
export class ProductEntity extends BaseEntity {
  @Index()
  @Column({
    type: 'varchar',
    length: 255,
  })
  title: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  price: number;

  @Column({
    type: 'int',
    name: 'quantity_in_stock',
  })
  quantityInStock: number;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.product)
  orderItems: OrderItemEntity[];
}
