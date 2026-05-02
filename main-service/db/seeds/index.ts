import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../src/users/entities/user.entity';
import { ProductEntity } from '../../src/products/entities/product.entity';
import { OrderEntity } from '../../src/orders/entities/order.entity';
import { OrderItemEntity } from '../../src/orders/entities/order_item.entity';

export default class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userFactory = factoryManager.get(UserEntity);
    const productFactory = factoryManager.get(ProductEntity);
    const orderFactory = factoryManager.get(OrderEntity);

    // 1. Seed 10 Users
    // const users = await userFactory.saveMany(10);

    // 2. Seed 20 Products
    const products = await productFactory.saveMany(1000);

    // 3. Seed 20 Orders (assigned to random users)
    // const orders = await Promise.all(
    //   Array.from({ length: 20 }).map(() =>
    //     orderFactory.save({
    //       user: users[Math.floor(Math.random() * users.length)],
    //     }),
    //   ),
    // );

    // 4. Seed 50 Order Items
    // const orderItemRepo = dataSource.getRepository(OrderItemEntity);
    // for (let i = 0; i < 50; i++) {
    //   const randomOrder = orders[Math.floor(Math.random() * orders.length)];
    //   const randomProduct =
    //     products[Math.floor(Math.random() * products.length)];
    //
    //   await orderItemRepo.save({
    //     orderId: randomOrder.id,
    //     productId: randomProduct.id,
    //     quantity: Math.floor(Math.random() * 5) + 1,
    //     priceAtPurchase: randomProduct.price,
    //   });
    // }
  }
}
