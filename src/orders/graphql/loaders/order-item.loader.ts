import { In, Repository } from 'typeorm';
import { OrderItemEntity } from '../../entities/order_item.entity';
import DataLoader from 'dataloader';

export const createOrderItemsLoader = (
  repository: Repository<OrderItemEntity>,
) =>
  new DataLoader<string, OrderItemEntity[]>(async (orderIds) => {
    const items = await repository.find({
      where: { orderId: In([...orderIds]) },
    });

    const itemsByOrderId = new Map<string, OrderItemEntity[]>();

    for (const item of items) {
      const existing = itemsByOrderId.get(item.orderId) || [];
      existing.push(item);
      itemsByOrderId.set(item.orderId, existing);
    }

    return orderIds.map((id) => itemsByOrderId.get(id) || []);
  });