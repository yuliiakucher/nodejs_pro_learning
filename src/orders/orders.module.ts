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
import { OrderItemResolver, OrdersResolver } from './graphql/order.resolver';
import { OrderStatusEntity } from './entities/order_status.entity';
import { RoleEntity } from '../users/entities/roles.entity';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';
import { Consumer } from './consumer';
import { ProcessedMessagesEntity } from '../rabbitmq/entities/processed_messages.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      OrderEntity,
      OrderItemEntity,
      UserEntity,
      OrderStatusEntity,
      RoleEntity,
      ProcessedMessagesEntity,
    ]),
    UsersModule,
    RabbitmqModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    UsersService,
    ProductsService,
    OrdersResolver,
    OrderItemResolver,
    RabbitmqService,
    Consumer,
  ],
})
export class OrdersModule {}
