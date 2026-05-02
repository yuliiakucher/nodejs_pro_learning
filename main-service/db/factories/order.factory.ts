import { setSeederFactory } from 'typeorm-extension';
import { OrderEntity } from '../../src/orders/entities/order.entity';

// Order Factory
export default setSeederFactory(OrderEntity, (faker) => {
  const order = new OrderEntity();
  order.deliveryAddress = faker.location.streetAddress();
  order.idempotencyKey = faker.string.uuid();
  return order;
});
