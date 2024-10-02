import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Order } from 'src/interfaces/front/order.interface';
import { Orders64Service } from './orders-64.service';

@Controller('orders-64')
export class Orders64Controller {
    constructor(private readonly ordersService: Orders64Service){}

    @Post()
    async createOrder(@Body() order: Order) {
        order.datetime = new Date();
        return this.ordersService.createOrder(order);
    }

    @Get()
    async findAllOrders() {
        return this.ordersService.findAllOrders();
    }

    @Get('table:tableNumber')
    async findAllOrdersForTable(tableNumber: number) {
        return this.ordersService.findAllOrdersForTable(tableNumber);
    }

    @Get('bill/table')
    async getBillForTable(@Query('tableNumber') tableNumber: number) {
        return this.ordersService.getBillForTable(tableNumber);
    }

    @Get('bill/event')
    async getBillForEvent(@Query('eventId') eventId: string) {
        return this.ordersService.getBillForEvent(eventId);
    }

}