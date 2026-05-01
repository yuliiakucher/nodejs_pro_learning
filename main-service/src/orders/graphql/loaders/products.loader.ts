import { In, Repository } from 'typeorm';
import DataLoader from 'dataloader';
import { ProductEntity } from '../../../products/entities/product.entity';

export const createProductsLoader = (repository: Repository<ProductEntity>) =>
  new DataLoader<string, ProductEntity | null>(async (productIds) => {
    const products = await repository.find({
      where: { id: In([...productIds]) },
    });

    const productByOrderId = new Map<string, ProductEntity>(
      products.map((product) => [product.id, product]),
    );

    return productIds.map((id) => productByOrderId.get(id) || null);
  });
