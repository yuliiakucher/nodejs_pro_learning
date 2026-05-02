import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { OrderStatusEntity } from '../../entities/order_status.entity';

export const createOrderStatusLoader = (
  repository: Repository<OrderStatusEntity>,
) =>
  new DataLoader<string, OrderStatusEntity | null>(async (orderStatusIds) => {
    const orderStatuses = await repository.find({
      where: { id: In(orderStatusIds) },
    });

    const orderStatusesMap = new Map<string, OrderStatusEntity>(
      orderStatuses.map((status) => [status.id, status]),
    );

    return orderStatusIds.map((id) => orderStatusesMap.get(id) || null);
  });
