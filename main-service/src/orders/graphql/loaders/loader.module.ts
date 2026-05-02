import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserEntity } from '../../../users/entities/user.entity';
import { ProductEntity } from '../../../products/entities/product.entity';
import { OrderItemEntity } from '../../entities/order_item.entity';
import { LoadersFactory } from './loader.factory';
import { OrderStatusEntity } from '../../entities/order_status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ProductEntity,
      OrderItemEntity,
      OrderStatusEntity,
    ]),
  ],
  providers: [LoadersFactory],
  exports: [LoadersFactory],
})
export class LoadersModule {}
