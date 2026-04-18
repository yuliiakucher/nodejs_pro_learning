import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItemEntity } from './entities/order_item.entity';
import { UserEntity } from '../users/entities/user.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { IPagination } from './graphql/order.resolver';
import { OrderStatusEntity } from './entities/order_status.entity';
import { OrdersFilterInputDto } from './dto/order-status-input.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderStatusEntity)
    private readonly orderStatusRepository: Repository<OrderStatusEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    private dataSource: DataSource,
  ) {}

  // decided on pessimistic locking to avoid conflicts by blocking other transactions during the transaction execution
  async create(createOrderDto: CreateOrderDto, idempotencyKey: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const existingOrder = await queryRunner.manager.findOne(OrderEntity, {
        where: { idempotencyKey },
      });

      // returning existing order with 201 status code so the client gets the same response if order actually created
      if (existingOrder) {
        return existingOrder;
      }

      const { user: userId, deliveryAddress, cartItems } = createOrderDto;

      const user = await queryRunner.manager.findOne(UserEntity, {
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const statusNew = await queryRunner.manager.findOne(OrderStatusEntity, {
        where: { name: 'NEW' },
      });

      if (!statusNew) {
        throw new NotFoundException('Status not found');
      }

      const order = queryRunner.manager.create(OrderEntity, {
        user,
        deliveryAddress,
        idempotencyKey,
        orderStatus: statusNew,
      });

      await queryRunner.manager.save(OrderEntity, order);

      for (const item of cartItems) {
        const product = await queryRunner.manager
          .createQueryBuilder(ProductEntity, 'product')
          .where({ id: item.productId })
          .setLock('for_no_key_update')
          .getOne();

        if (!product) {
          throw new NotFoundException('Product not found');
        }

        if (product.quantityInStock < item.quantity) {
          // throwing 409 error due to the conflict
          throw new HttpException(
            'Not enough products in stock available',
            HttpStatus.CONFLICT,
          );
        }

        product.quantityInStock -= item.quantity;

        await queryRunner.manager.save(ProductEntity, product);

        const orderItem = queryRunner.manager.create(OrderItemEntity, {
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: product.price,
          orderId: order.id,
        });

        await queryRunner.manager.save(OrderItemEntity, orderItem);
      }

      await queryRunner.commitTransaction();

      return order;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(filters: OrdersFilterInputDto, pagination: IPagination) {
    const { dateFrom, dateTo, status } = filters;

    const queryBuilder = this.orderRepository.createQueryBuilder('order');
    // .leftJoinAndSelect('order.orderStatus', 'orderStatus')
    // .leftJoinAndSelect('order.orderItems', 'orderItems')
    // .leftJoinAndSelect('orderItems.product', 'product');

    if (filters.status) {
      const orderStatus = await this.orderStatusRepository.findOne({
        where: {
          name: status,
        },
      });
      queryBuilder.where('order.orderStatus = :orderStatus', {
        orderStatus: orderStatus?.id,
      });
    }

    if (dateFrom) {
      queryBuilder.andWhere('order.createdAt >= :dateFrom', {
        dateFrom,
      });
    }

    if (dateTo) {
      queryBuilder.andWhere('order.createdAt <= :dateTo', {
        dateTo,
      });
    }

    queryBuilder.skip(pagination.offset).take(pagination.limit);

    const nodes = await queryBuilder.getMany();
    const totalCount = await queryBuilder.getCount();

    return {
      nodes,
      pageInfo: { offset: pagination.offset, limit: pagination.limit },
      totalCount,
    };
  }

  async findAllREST() {
    return await this.orderRepository.find({
      relations: ['user', 'orderItems', 'orderStatus'],
    });
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async remove(id: string) {
    return await this.orderRepository.delete(id);
  }

  async findOneStatus(id: string) {
    const status = await this.orderStatusRepository.findOne({ where: { id } });
    if (!status) {
      throw new NotFoundException('Order status not found');
    }
    return status;
  }

  async findOrderItemById(id: string) {
    const orderItems = await this.orderItemRepository.find({
      where: { orderId: id },
    });
    return orderItems;
  }
}
