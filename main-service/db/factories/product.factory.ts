import { setSeederFactory } from 'typeorm-extension';
import { ProductEntity } from '../../src/products/entities/product.entity';

// Product Factory
export default setSeederFactory(ProductEntity, (faker) => {
  const product = new ProductEntity();
  product.title = faker.commerce.productName();
  product.description = faker.commerce.productDescription();
  product.price = parseFloat(faker.commerce.price());
  product.quantityInStock = faker.number.int({ min: 10, max: 100 });
  return product;
});
