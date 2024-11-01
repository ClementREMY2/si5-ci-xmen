import { Body, Controller, Param, Post } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { RemoveFromOrderDto } from './dto/remove-from-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }
  @Post('createEventOrder/:eventName')
  createEventOrder(
    @Param('eventName') eventName: string,
    @Body('items') items: RemoveFromOrderDto[],
  ) {
    return this.ordersService.createEventOrder(eventName, items);
  }
}
