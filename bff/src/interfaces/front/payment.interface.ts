import { OrderItems } from './order.interface';

export interface Payment {
  itemsEvent: OrderItems;
  items: OrderItems;
  ended: boolean;
  table: number;
  date: Date;
}
