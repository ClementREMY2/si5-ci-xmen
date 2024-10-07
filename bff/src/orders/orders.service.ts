import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Preparation } from 'src/interfaces/back/kitchen.interfaces';
import { Menu } from 'src/interfaces/back/menu.interface';
import { Order } from 'src/interfaces/front/order.interface';
import {
  concatAllOrdersForEventInOne,
  concatAllOrdersOfATableForEventInOne,
  concatAllOrdersOfATableInOne,
  getLastOrderForEvent,
  getLastOrderOfATable,
  getLastOrderOfATableForEvent,
} from 'src/utils/order-utils';

@Injectable()
export class OrdersService {
  async createOrder(order: Order) {
    let itemOrderFullName = 'itemsOrder';
    for (const [itemId, quantity] of Object.entries(order.items)) {
      itemOrderFullName += `|${itemId}|${quantity}`;
    }

    let itemsEventList = 'itemsEvent';
    for (const [itemId, quantity] of Object.entries(order.itemsEvent)) {
      itemsEventList += `|${itemId}|${quantity}`;
    }

    const itemOrderShortName =
      'itemsOrder' + order.table + '|' + new Date().toISOString();
    const itemEventShortName =
      'itemsEvent' + order.table + '|' + new Date().toISOString();

    const itemOrder = {
      shortName: itemOrderShortName,
      fullName: itemOrderFullName,
      price: 10,
      category: 'STARTER',
      image: 'https://null.com',
    };

    const itemEvent = {
      shortName: itemEventShortName,
      fullName: itemsEventList,
      price: 10,
      category: 'STARTER',
      image: 'https://null.com',
    };

    const resItemOrder: Menu = await axios
      .post('http://localhost:9500/menu/menus', itemOrder)
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(`Failed to create order: ${error.message}`);
      });

    const resItemEvent: Menu = await axios
      .post('http://localhost:9500/menu/menus', itemEvent)
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(`Failed to create order: ${error.message}`);
      });

    const orderFullName =
      'order|' +
      order.table +
      '|' +
      order.event +
      '|' +
      resItemOrder._id +
      '|' +
      resItemEvent._id;
    const orderShortName =
      'order' + order.table + '|' + new Date().toISOString();

    const orderItem = {
      shortName: orderShortName,
      fullName: orderFullName,
      price: 10,
      category: 'STARTER',
      image: 'https://null.com',
    };

    const resOrder: Menu = await axios
      .post('http://localhost:9500/menu/menus', orderItem)
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(`Failed to create order: ${error.message}`);
      });

    return order;
  }

  async findAllOrdersForTable(tableNumber: number) {
    const menuItems: Menu[] = await axios
      .get('http://localhost:9500/menu/menus')
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(`Failed to fetch menus: ${error.message}`);
      });

    const orders = concatAllOrdersOfATableInOne(menuItems, tableNumber);
    return orders;
  }

  async findLastOrderOfTable(tableNumber: number) {
    const menuItems: Menu[] = await axios
      .get('http://localhost:9500/menu/menus')
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(`Failed to fetch menus: ${error.message}`);
      });

    const orders = getLastOrderOfATable(menuItems, tableNumber);
    return orders;
  }

  async findAllOrdersForAnEvent(eventId: string) {
    const menuItems: Menu[] = await axios
      .get('http://localhost:9500/menu/menus')
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(`Failed to fetch menus: ${error.message}`);
      });

    const orders = concatAllOrdersForEventInOne(menuItems, eventId);
    return orders;
  }

  async findAllOrdersForATableAndEvent(tableNumber: number, eventId: string) {
    const menuItems: Menu[] = await axios
      .get('http://localhost:9500/menu/menus')
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(`Failed to fetch menus: ${error.message}`);
      });

    const orders = concatAllOrdersOfATableForEventInOne(
      menuItems,
      tableNumber,
      eventId,
    );
    return orders;
  }

  async findLastOrderOfATableAndEvent(tableNumber: number, eventId: string) {
    const menuItems: Menu[] = await axios
      .get('http://localhost:9500/menu/menus')
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(`Failed to fetch menus: ${error.message}`);
      });

    const orders = getLastOrderOfATableForEvent(
      menuItems,
      tableNumber,
      eventId,
    );
    return orders;
  }

  async findLastOrderOfEvent(eventId: string) {
    const menuItems: Menu[] = await axios
      .get('http://localhost:9500/menu/menus')
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(`Failed to fetch menus: ${error.message}`);
      });

    const orders = getLastOrderForEvent(menuItems, eventId);
    return orders;
  }
}
