import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Headers,
  BadRequestException,
  Get,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('support')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
