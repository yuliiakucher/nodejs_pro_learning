import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Headers,
  BadRequestException, Get,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Headers() headers: Record<string, string>,
  ) {
    const idempotencyKey = headers['x-idempotency-key'];
    if (!idempotencyKey) {
      throw new BadRequestException('Invalid idempotency key');
    }
    return this.ordersService.create(createOrderDto, idempotencyKey);
  }

  @Get()
  findAll() {
    return this.ordersService.findAllREST();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
