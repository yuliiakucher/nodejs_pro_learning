import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../products/entities/product.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order_item.entity';
import { UserEntity } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      OrderEntity,
      OrderItemEntity,
      UserEntity,
    ]),
    UsersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, UsersService, ProductsService],
})
export class OrdersModule {}
