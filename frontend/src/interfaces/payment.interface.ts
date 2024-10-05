import { OrderItems } from "./Order";

export interface Payment {
  table: number;
  date: Date;
  items: OrderItems;
  itemsEvent: OrderItems;
  ended: boolean;
}
