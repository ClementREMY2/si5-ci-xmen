import { Injectable } from '@nestjs/common';
import { Menu } from 'src/interfaces/back/menu.interface';
import { Order, OrderItems } from 'src/interfaces/front/order.interface';
import {
  encodeObjectToBase64,
  findAllOrders,
  getLastPaymentOfTable,
  saveMenu,
} from 'src/utils/encode64-utils';

@Injectable()
export class Orders64Service {
  async findAllOrdersForTable(tableNumber: number) {
    const lastPaymentOfTable = await getLastPaymentOfTable(tableNumber);
    const orders = await findAllOrders();
    const ordersOfTable = orders.filter(
      (order) =>
        order.table === tableNumber && order.datetime > lastPaymentOfTable.date,
    );
    return ordersOfTable;
  }

  async getBillForTable(tableNumber: number) {
    const lastPaymentOfTable = await getLastPaymentOfTable(tableNumber);

    const orders = await findAllOrders();

    const ordersOfTable: Order[] = orders.filter(
      (order) =>
        order.table == tableNumber &&
        (!lastPaymentOfTable || order.datetime > lastPaymentOfTable.date),
    );
    const items: OrderItems = {};
    const itemsEvent: OrderItems = {};
    ordersOfTable.forEach((order: Order) => {
      if (order.items) {
        Object.entries(order.items).forEach(([itemId, quantity]) => {
          if (items[itemId]) {
            items[itemId] += quantity;
          } else {
            items[itemId] = quantity;
          }
        });
      }
      if (order.itemsEvent) {
        Object.entries(order.itemsEvent).forEach(([itemId, quantity]) => {
          if (itemsEvent[itemId]) {
            itemsEvent[itemId] += quantity;
          } else {
            itemsEvent[itemId] = quantity;
          }
        });
      }
    });

    if (ordersOfTable.length === 0) {
      return { table: tableNumber, total: 0, items: {}, itemsEvent: {} };
    }
    const order: Order = {
      table: tableNumber,
      event: ordersOfTable[0]?.event,
      datetime: new Date(),
      total: ordersOfTable.reduce((acc, curr) => acc + curr.total, 0),
      items,
      itemsEvent,
    };

    return order;
  }

  async getBillForEvent(eventId: string) {
    const orders = await findAllOrders();

    const ordersOfEvent = orders.filter((order) => order.event === eventId);
    const items: OrderItems = {};
    const itemsEvent: OrderItems = {};
    ordersOfEvent.forEach((order: Order) => {
      Object.entries(order.items).forEach(([itemId, quantity]) => {
        if (items[itemId]) {
          items[itemId] += quantity;
        } else {
          items[itemId] = quantity;
        }
      });
      Object.entries(order.itemsEvent).forEach(([itemId, quantity]) => {
        if (itemsEvent[itemId]) {
          itemsEvent[itemId] += quantity;
        } else {
          itemsEvent[itemId] = quantity;
        }
      });
    });

    if (ordersOfEvent.length === 0) {
      return { event: eventId, total: 0, items: {}, itemsEvent: {} };
    }
    const order: Order = {
      event: eventId,
      datetime: new Date(),
      total: ordersOfEvent.reduce((acc, curr) => acc + curr.total, 0),
      items,
      itemsEvent,
    };

    return order;
  }

  async findAllOrders(): Promise<Order[]> {
    const orders = await findAllOrders();
    console.log(orders);
    return orders;
  }

  async createOrder(order: Order) {
    const menu = encodeObjectToBase64(order);
    const res: Menu = await saveMenu(menu);
    order.id = res._id;
    return order;
  }
}
