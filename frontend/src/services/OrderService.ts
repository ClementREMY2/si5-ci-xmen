import { menuNormalMock } from "./../mocks/Menu";
import axios from "axios";
import { Payment } from "../interfaces/payment.interface";
import { Order, OrderItems } from "../interfaces/Order";
import { Buffer } from "buffer";

function encodeObjectToBase64(obj: any): any {
  const jsonString = JSON.stringify(obj);
  const base64String = Buffer.from(jsonString).toString("base64");
  console.log(jsonString);
  const menu = {
    shortName: new Date().toISOString(),
    fullName: base64String,
    price: 10,
    category: "STARTER",
    image: "https://null.com",
  };
  return menu;
}

function isOrder(obj: any): obj is Order {
  return (
    typeof obj.table === "number" &&
    typeof obj.datetime === "string" &&
    typeof obj.total === "number" &&
    (typeof obj.items === "object" || typeof obj.itemsEvent === "object")
  );
}

async function findAllOrders(): Promise<Order[]> {
  const menuItems: Menu[] = await axios
    .get("http://localhost:9500/menu/menus")
    .then((response: { data: any }) => response.data)
    .catch((error: { message: any }) => {
      throw new Error(`Failed to fetch menus: ${error.message}`);
    });

  const fullNamesDecoded = menuItems
    .map((menuItem) => {
      try {
        const decoded = Buffer.from(menuItem.fullName, "base64").toString(
          "ascii"
        );
        const decodedObj = JSON.parse(decoded);
        decodedObj.id = menuItem._id;
        return decodedObj;
      } catch (e) {
        return null;
      }
    })
    .filter((decoded) => decoded !== null);

  const ordersTyped = fullNamesDecoded.filter(isOrder);

  return ordersTyped;
}

interface Menu {
  _id: string;
  fullName: string;
  shortName: string;
  price: number;
  category: "STARTER" | "MAIN" | "DESSERT";
  image: string;
}

function isPayment(obj: any): obj is Payment {
  return (
    typeof obj.table === "number" &&
    typeof obj.date === "string" &&
    typeof obj.payment === "boolean"
  );
}

async function getLastPaymentOfTable(
  tableNumber: number
): Promise<Payment | null> {
  const payments: Menu[] = await axios
    .get("http://localhost:9500/menu/menus")
    .then((response: { data: any }) => response.data)
    .catch((error: { message: any }) => {
      throw new Error(`Failed to fetch payments: ${error.message}`);
    });

  const fullNamesDecoded = payments
    .map((payment) => {
      try {
        const decoded = Buffer.from(payment.fullName, "base64").toString(
          "ascii"
        );
        const decodedObj = JSON.parse(decoded);
        decodedObj.id = payment._id;
        return decodedObj;
      } catch (e) {
        return null;
      }
    })
    .filter((decoded) => decoded !== null)
    .filter(isPayment);

  const lastPayment = fullNamesDecoded.reduce<Payment | null>(
    (acc, payment) => {
      if (payment.table == tableNumber) {
        if (acc === null) {
          return payment;
        }
        if (new Date(payment.date) > new Date(acc.date)) {
          return payment;
        }
      }
      return acc;
    },
    null
  );

  return lastPayment;
}

export const getTableOrders = async (tableNumber: number) => {
  const lastPaymentOfTable = await getLastPaymentOfTable(tableNumber);

  const orders = await findAllOrders();

  const ordersOfTable: Order[] = orders.filter(
    (order) =>
      order.table == tableNumber &&
      (!lastPaymentOfTable ||
        (order.datetime && order.datetime > lastPaymentOfTable.date))
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

  return { items, itemsEvent };
};

export function createOrder(order: Order): Promise<Order> {
  if (order.event === undefined) {
    delete order.event;
  }
  const encodedOrder = encodeObjectToBase64(order);
  return axios.post("http://localhost:9500/menu/menus", encodedOrder);
}
