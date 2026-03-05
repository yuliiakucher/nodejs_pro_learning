import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductEntity } from '../../products/entities/product.entity';
import { BaseEntity } from '../../common/base.entity';

@Entity('order_items')
export class OrderItemEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    name: 'order_id',
  })
  orderId: string;
  @ManyToOne(() => OrderEntity, (order) => order.orderItems)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @Column({
    type: 'uuid',
    name: 'product_id',
  })
  productId: string;
  @ManyToOne(() => ProductEntity, (product) => product.orderItems)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column({
    name: 'price_at_purchase',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  priceAtPurchase: number;

  @Column({
    type: 'int',
  })
  quantity: number;
}
