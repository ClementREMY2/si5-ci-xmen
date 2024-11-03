import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RemoveFromOrderDto } from './dto/remove-from-order.dto';

@Injectable()
export class OrdersService {
  async getAllOrders() {
    try {
      const response = await axios.get(
        'http://localhost:9500/dining/tableOrders',
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }
  }

  async getOrderById(id: string) {
    try {
      const response = await axios.get(
        `http://localhost:9500/dining/tableOrders/${id}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch order: ${error.message}`);
    }
  }

  async createEventOrder(eventName: string, items: RemoveFromOrderDto[]) {
    try {
      console.log(items)
      const eventOrder = await axios.post(
        `http://localhost:9500/dining/tableOrders`,
        {
          event: eventName,
          customersCount: 1,
        },
      );

      for (const item of items) {
        for (const menuItem of item.menuItems) {
          await axios.put(
            `http://localhost:9500/dining/tableOrders/${item.orderId}/remove-preparation/${menuItem}`,
          );

          await axios.post(
            `http://localhost:9500/dining/tableOrders/${eventOrder.data._id}`,
            {
              menuItemId: menuItem,
            },
          );
        }
      }

      return await this.getOrderById(eventOrder.data._id);
    } catch (error) {
      throw new Error(`Failed to create event order: ${error.message}`);
    }
  }

  async billOrder(orderId: string) {
    try {
      await axios.post(
        `http://localhost:9500/dining/tableOrders/${orderId}/bill`,
      );
      return await this.getOrderById(orderId);
    } catch (error) {
      throw new Error(`Failed to bill order: ${error.message}`);
    }
  }

  async sendMenuItem(
    menuItemId: string,
    fromOrderId: string,
    toOrderId: string,
  ) {
    try {
      await axios.put(
        `http://localhost:9500/dining/tableOrders/${fromOrderId}/remove-preparation/${menuItemId}`,
      );

      await axios.post(
        `http://localhost:9500/dining/tableOrders/${toOrderId}`,
        {
          menuItemId,
        },
      );

      return await this.getOrderById(toOrderId);
    } catch (error) {
      throw new Error(`Failed to send menu item: ${error.message}`);
    }
  }

  async getOrdersByTable(tableNumber: number) {
    try {
      const orders = await axios.get(
        `http://localhost:9500/dining/tableOrders`,
      );

      const tableOrders = orders.data.filter(
        (order) => order.tableNumber == tableNumber && order.billed === null,
      );
      return tableOrders;
    } catch (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }
  }
}
