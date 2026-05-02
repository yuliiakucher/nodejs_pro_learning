import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItemEntity } from '../../entities/order_item.entity';
import { createOrderItemsLoader } from './order-item.loader';
import { ProductEntity } from '../../../products/entities/product.entity';
import { createProductsLoader } from './products.loader';
import { createOrderStatusLoader } from './order-status.loader';
import { OrderStatusEntity } from '../../entities/order_status.entity';

@Injectable()
export class LoadersFactory {
  constructor(
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepo: Repository<OrderItemEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(OrderStatusEntity)
    private readonly orderStatusRepo: Repository<OrderStatusEntity>,
  ) {}

  createLoaders() {
    return {
      orderItemsLoader: createOrderItemsLoader(this.orderItemRepo),
      productsLoader: createProductsLoader(this.productRepo),
      orderStatusLoader: createOrderStatusLoader(this.orderStatusRepo),
    };
  }
}
