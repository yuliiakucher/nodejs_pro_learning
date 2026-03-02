import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UsersService } from '../users/users.service';
import { OrderItemEntity } from './entities/order_item.entity';
import { ProductsService } from '../products/products.service';
import { UserEntity } from '../users/entities/user.entity';
import { ProductEntity } from '../products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    private userService: UsersService,
    private productsService: ProductsService,
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

      const order = queryRunner.manager.create(OrderEntity, {
        user,
        deliveryAddress,
        idempotencyKey,
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

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async remove(id: string) {
    return await this.orderRepository.delete(id);
  }
}
