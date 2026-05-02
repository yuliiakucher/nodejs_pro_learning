import DataLoader from 'dataloader';
import { OrderItemEntity } from '../../entities/order_item.entity';
import { ProductEntity } from '../../../products/entities/product.entity';
import { OrderStatusEntity } from '../../entities/order_status.entity';

export type AppLoaders = {
  orderItemsLoader: DataLoader<string, OrderItemEntity[]>;
  productsLoader: DataLoader<string, ProductEntity>;
  orderStatusLoader: DataLoader<string, OrderStatusEntity>;
};

export type GraphQLContext = {
  loaders: AppLoaders;
};
