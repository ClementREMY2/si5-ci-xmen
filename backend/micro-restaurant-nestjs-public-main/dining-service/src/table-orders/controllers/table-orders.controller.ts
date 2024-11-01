import { Body, Controller, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import {
  ApiBody,
  ApiUnprocessableEntityResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags, ApiOkResponse, ApiParam,
} from '@nestjs/swagger';

import { StartOrderingDto } from '../dto/start-ordering.dto';
import { AddMenuItemDto } from '../dto/add-menu-item.dto';

import { GetTableOrderParams } from '../params/get-table-order.params';

import { TableOrder } from '../schemas/table-order.schema';

import { TableOrderIdNotFoundException } from '../exceptions/table-order-id-not-found.exception';
import { TableAlreadyTakenException } from '../../tables/exceptions/table-already-taken.exception';
import { TableNumberNotFoundException } from '../../tables/exceptions/table-number-not-found.exception';

import { TableOrdersService } from '../services/table-orders.service';
import { AddMenuItemDtoNotFoundException } from '../exceptions/add-menu-item-dto-not-found.exception';
import { TableOrderAlreadyBilledException } from '../exceptions/table-order-already-billed.exception';
import { PreparationDto } from '../dto/preparation.dto';

@ApiTags('tableOrders')
@Controller('/tableOrders')
export class TableOrdersController {
  constructor(private readonly tableOrdersService: TableOrdersService) {}

  @ApiOkResponse({ type: TableOrder, isArray: true })
  @Get()
  async listAllTableOrders(): Promise<TableOrder[]> {
    return this.tableOrdersService.findAll();
  }

  @ApiBody({ type: StartOrderingDto })
  @ApiCreatedResponse({ type: TableOrder, description: 'The table has been successfully opened.' })
  @ApiNotFoundResponse({ type: TableNumberNotFoundException, description: 'Table not found' })
  @ApiUnprocessableEntityResponse({ type: TableAlreadyTakenException, description: 'Table is already taken' })
  @Post()
  async openTable(@Body() startOrderingDto: StartOrderingDto): Promise<TableOrder> {
    console.log('startOrderingDto', startOrderingDto);
    return await this.tableOrdersService.startOrdering(startOrderingDto);
  }

  @ApiParam({ name: 'tableOrderId' })
  @ApiOkResponse({ type: TableOrder })
  @ApiNotFoundResponse({ type: TableOrderIdNotFoundException, description: 'Table order not found' })
  @Get(':tableOrderId')
  async getTableOrderById(@Param() getTableOrderParams: GetTableOrderParams): Promise<TableOrder> {
    return this.tableOrdersService.findOne(getTableOrderParams.tableOrderId);
  }

  @ApiParam({ name: 'tableOrderId' })
  @ApiBody({ type: AddMenuItemDto })
  @ApiCreatedResponse({ type: TableOrder, description: 'The menu item has been successfully added to the table order.' })
  @ApiNotFoundResponse({ type: TableOrderIdNotFoundException, description: 'Table order not found' })
  @ApiNotFoundResponse({ type: AddMenuItemDtoNotFoundException, description: 'Inconsistent AddMenuItemDto with the MenuServiceProxy' })
  @ApiUnprocessableEntityResponse({ type: TableOrderAlreadyBilledException, description: 'TableOrder is already billed' })
  @Post(':tableOrderId')
  async addMenuItemToTableOrder(@Param() getTableOrderParams: GetTableOrderParams, @Body() addMenuItemDto: AddMenuItemDto): Promise<TableOrder> {
    return this.tableOrdersService.addMenuItemToTableOrder(getTableOrderParams.tableOrderId, addMenuItemDto);
  }


  @ApiParam({ name: 'tableOrderId' })
  @ApiOkResponse({ type: TableOrder, description: 'The table has been successfully billed.' })
  @ApiNotFoundResponse({ type: TableOrderIdNotFoundException, description: 'Table order not found' })
  @ApiUnprocessableEntityResponse({ type: TableOrderAlreadyBilledException, description: 'TableOrder is already billed' })
  @HttpCode(200)
  @Post(':tableOrderId/bill')
  async billTableOrder(@Param() getTableOrderParams: GetTableOrderParams): Promise<TableOrder> {
    return this.tableOrdersService.billOrder(getTableOrderParams.tableOrderId);
  }


  @ApiParam({ name: 'tableOrderId' })
  @ApiParam({ name: 'orderItemId' })
  @ApiOkResponse({ type: TableOrder, description: 'The order item has been successfully removed from preparations.' })
  @ApiNotFoundResponse({ type: TableOrderIdNotFoundException, description: 'Table order not found' })
  @ApiUnprocessableEntityResponse({ type: TableOrderAlreadyBilledException, description: 'TableOrder is already billed' })
  @HttpCode(200)
  @Put(':tableOrderId/remove-preparation/:orderItemId')
  async removeOrderItemFromPreparation(
    @Param('tableOrderId') tableOrderId: string,
    @Param('orderItemId') orderItemId: string
  ): Promise<TableOrder> {
    return this.tableOrdersService.removeOrderItemFromPreparation(tableOrderId, orderItemId);
  }


  @ApiParam({ name: 'tableOrderId' })
  @ApiParam({ name: 'orderItemId' })
  @ApiOkResponse({ type: TableOrder, description: 'The order item has been successfully added to preparations.' })
  @ApiNotFoundResponse({ type: TableOrderIdNotFoundException, description: 'Table order not found' })
  @ApiUnprocessableEntityResponse({ type: TableOrderAlreadyBilledException, description: 'TableOrder is already billed' })
  @HttpCode(200)
  @Put(':tableOrderId/add-preparation/:orderItemId')
  async addOrderItemToPreparation(
    @Param('tableOrderId') tableOrderId: string,
    @Param('orderItemId') orderItemId: string
  ): Promise<TableOrder> {
    return this.tableOrdersService.addOrderItemToPreparation(tableOrderId, orderItemId);
  }


  
}


