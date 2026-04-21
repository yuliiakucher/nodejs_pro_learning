import { IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatusInput } from '../../graphql';

export class OrdersFilterInputDto {
  @IsOptional()
  status?: OrderStatusInput;

  @IsOptional()
  @IsDate({ message: 'dateFrom must be a valid ISO date format' })
  @Type(() => Date)
  dateFrom?: Date;

  @IsOptional()
  @IsDate({ message: 'dateTo must be a valid ISO date format' })
  @Type(() => Date)
  dateTo?: Date;
}
