import { IsInt, IsUUID, Max, Min } from 'class-validator';

export class CartItems {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(0)
  @Max(100)
  quantity: number;
}
