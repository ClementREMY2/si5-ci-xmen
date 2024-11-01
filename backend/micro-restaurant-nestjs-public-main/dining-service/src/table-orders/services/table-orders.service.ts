import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Table } from '../../tables/schemas/table.schema';
import { TableOrder, TableOrderDocument } from '../schemas/table-order.schema';
import { OrderingItem } from '../schemas/ordering-item.schema';
import { OrderingLine } from '../schemas/ordering-line.schema';

import { StartOrderingDto } from '../dto/start-ordering.dto';
import { AddMenuItemDto } from '../dto/add-menu-item.dto';
import { PreparationDto } from '../dto/preparation.dto';

import { OrderingLinesWithPreparations } from '../interfaces/ordering-lines-with-preparations.interface';

import { TablesService } from '../../tables/services/tables.service';
import { MenuProxyService } from './menu-proxy.service';
import { KitchenProxyService } from './kitchen-proxy.service';

import { TableOrderIdNotFoundException } from '../exceptions/table-order-id-not-found.exception';
import { AddMenuItemDtoNotFoundException } from '../exceptions/add-menu-item-dto-not-found.exception';
import { TableOrderAlreadyBilledException } from '../exceptions/table-order-already-billed.exception';
import { MenuItem } from '../schemas/menu-item.schema';

@Injectable()
export class TableOrdersService {
  constructor(
    @InjectModel(TableOrder.name) private tableOrderModel: Model<TableOrderDocument>,
    private readonly tablesService: TablesService,
    private readonly menuProxyService: MenuProxyService,
    private readonly kitchenProxyService: KitchenProxyService,
  ) {}

  async findAll(): Promise<TableOrder[]> {
    return this.tableOrderModel.find().lean();
  }

  async findOne(tableOrderId: string): Promise<TableOrder> {
    const foundItem = await this.tableOrderModel.findOne({ _id: tableOrderId }).lean();

    if (foundItem === null) {
      throw new TableOrderIdNotFoundException(tableOrderId);
    }

    return foundItem;
  }

  async startOrdering(startOrderingDto: StartOrderingDto): Promise<TableOrder> {

    const tableOrder: TableOrder = new TableOrder();
    tableOrder.tableNumber = startOrderingDto.tableNumber;
    tableOrder.customerName = startOrderingDto.customerName;
    tableOrder.event = startOrderingDto.event;
    tableOrder.customersCount = startOrderingDto.customersCount;
    tableOrder.opened = new Date();

    return await this.tableOrderModel.create(tableOrder);
  }

  async addMenuItemToTableOrder(tableOrderId: string, addMenuItemDto: AddMenuItemDto): Promise<TableOrder> {
    const tableOrder: TableOrder = await this.findOne(tableOrderId);

    if (tableOrder.billed !== null) {
      throw new TableOrderAlreadyBilledException(tableOrder);
    }

    const orderingItem: MenuItem = await this.menuProxyService.findById(addMenuItemDto.menuItemId);

    if (orderingItem === null) {
      throw new AddMenuItemDtoNotFoundException(addMenuItemDto);
    }

    if (addMenuItemDto.menuItemId !== orderingItem._id) {
      throw new AddMenuItemDtoNotFoundException(addMenuItemDto);
    }

    tableOrder.preparations.push(orderingItem._id);
    return this.tableOrderModel.findByIdAndUpdate(tableOrder._id, tableOrder, { returnDocument: 'after' });
  }


  async manageOrderingLines(tableNumber: number, orderingLines: OrderingLine[]): Promise<OrderingLinesWithPreparations> {
    let orderingLinesToSend: OrderingLine[] = [];

    const newOrderingLines: OrderingLine[] = orderingLines.map((orderingLine) => {
      if (!orderingLine.sentForPreparation) {
        orderingLinesToSend.push(orderingLine);
        orderingLine.sentForPreparation = true;
      }

      return orderingLine;
    });

    const preparations: PreparationDto[] = await this.kitchenProxyService.sendItemsToCook(tableNumber, orderingLinesToSend);

    return {
      orderingLines: newOrderingLines,
      preparations,
    };
  };


  async billOrder(tableOrderId: string): Promise<TableOrder> {
    const tableOrder: TableOrder = await this.findOne(tableOrderId);

    if (tableOrder.billed !== null) {
      throw new TableOrderAlreadyBilledException(tableOrder);
    }

    tableOrder.billed = new Date();

    // TODO: Send payment for the table order

    // TODO: Move next line when billing is managed
    //await this.tablesService.releaseTable(tableOrder.tableNumber);

    return this.tableOrderModel.findByIdAndUpdate(tableOrder._id, tableOrder, { returnDocument: 'after' });
  }


  async removeOrderItemFromPreparation(tableOrderId: string, orderItemId: string): Promise<TableOrder> {
    const tableOrder: TableOrder = await this.findOne(tableOrderId);

    if (tableOrder.billed !== null) {
      throw new TableOrderAlreadyBilledException(tableOrder);
    }

    // tableOrder.preparations = tableOrder.preparations.filter((preparation) => preparation._id !== orderItemId);

    return this.tableOrderModel.findByIdAndUpdate(tableOrder._id, tableOrder, { returnDocument: 'after' });
  }

  async addOrderItemToPreparation(tableOrderId: string, orderItemId: string): Promise<TableOrder> {
    const tableOrder: TableOrder = await this.findOne(tableOrderId);


    return this.tableOrderModel.findByIdAndUpdate(tableOrder._id, tableOrder, { returnDocument: 'after' });
  }
  
}
