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

  @Post('billOrder/:orderId')
  billOrder(@Param('orderId') orderId: string) {
    return this.ordersService.billOrder(orderId);
  }

  @Post('sendMenuItem')
  sendMenuItem(
    @Body('menuItemId') menuItemId: string,
    @Body('fromOrderId') fromOrderId: string,
    @Body('toOrderId') toOrderId: string,
  ) {
    return this.ordersService.sendMenuItem(menuItemId, fromOrderId, toOrderId);
  }
}
