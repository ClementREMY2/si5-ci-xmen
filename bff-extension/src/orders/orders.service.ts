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
            `http://localhost:9500/dining/tableOrders/${item.OrderId}/remove-preparation/${menuItem}`,
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
}
