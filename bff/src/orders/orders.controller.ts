import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from 'src/interfaces/front/order.interface';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService){}

    @Get('table/last')
    async findLastOrderOfATable(@Query('tableNumber') tableNumber: number) {
        return this.ordersService.findLastOrderOfTable(tableNumber);
    }

    @Get('/last')
    async findAllOrdersOfATableForEvent(@Query('tableNumber') tableNumber: number, @Query('eventId') eventId: string) {
        return this.ordersService.findAllOrdersForATableAndEvent(tableNumber, eventId);
    }

    @Get('event/last')
    async findLastOrderForEvent(@Query('eventId') eventId: string) {
        return this.ordersService.findLastOrderOfEvent(eventId);
    }

    @Get('payments/table')
    async findAllOrdersForTable(@Query('tableNumber') tableNumber: number) {
        return this.ordersService.findAllOrdersForTable(tableNumber);
    }

    @Get('payments/event')
    async findAllOrdersForAnEvent(@Query('eventId') eventId: string) {
        return this.ordersService.findAllOrdersForAnEvent(eventId);
    }

    @Get('payments')
    async findAllOrdersForATableAndEvent(@Query('tableNumber') tableNumber: number, @Query('eventId') eventId: string) {
        return this.ordersService.findAllOrdersForATableAndEvent(tableNumber, eventId);
    }


    @Post()
    async createOrder( @Body() order: Order) {
        return this.ordersService.createOrder( order);
    }
}
