import {
  Args,
  Resolver,
  Query,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { OrdersService } from '../orders.service';
import { OrderStatusEntity } from '../entities/order_status.entity';
import { OrderEntity } from '../entities/order.entity';
import { Order, OrderItems, OrdersResponse } from '../../graphql';
import { OrderItemEntity } from '../entities/order_item.entity';
import { ProductEntity } from '../../products/entities/product.entity';
import { ProductsService } from '../../products/products.service';
import { type GraphQLContext } from './loaders/loaders.types';
import { OrdersFilterInputDto } from '../dto/order-status-input.dto';

export interface IPagination {
  limit: number;
  offset: number;
}

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Query()
  async order(@Args('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Query(() => [OrderEntity])
  async orders(
    @Args('filter') filter: OrdersFilterInputDto,
    @Args('pagination') pagination: IPagination,
  ): Promise<OrdersResponse> {
    return await this.ordersService.findAll(filter, pagination);
  }

  @ResolveField(() => OrderStatusEntity)
  async orderStatus(
    @Parent() order: OrderEntity,
    @Context() ctx: GraphQLContext,
  ) {
    // return await this.ordersService.findOneStatus(order.statusId); //naive implementation
    return ctx.loaders.orderStatusLoader.load(order.statusId);
  }

  @ResolveField(() => [OrderItemEntity], { nullable: true })
  orderItems(@Parent() order: OrderEntity, @Context() ctx: GraphQLContext) {
    // return this.ordersService.findOrderItemById(order.id); //naive implementation
    return ctx.loaders.orderItemsLoader.load(order.id);
  }
}

@Resolver(() => OrderItems)
export class OrderItemResolver {
  constructor(private readonly productsService: ProductsService) {}

  @ResolveField(() => ProductEntity, { nullable: true })
  product(
    @Parent() orderItem: OrderItemEntity,
    @Context() ctx: GraphQLContext,
  ) {
    // return this.productsService.findOne(orderItem.productId); //naive implementation
    return ctx.loaders.productsLoader.load(orderItem.productId);
  }
}
