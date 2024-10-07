import { menuNormalMock } from "./../mocks/Menu";
import axios from "axios";
import { Payment } from "../interfaces/payment.interface";
import { Order, OrderItems } from "../interfaces/Order";
import { Buffer } from "buffer";

function encodeObjectToBase64(obj: any): any {
  const jsonString = JSON.stringify(obj);
  const base64String = Buffer.from(jsonString).toString("base64");
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
    typeof obj.ended === "boolean"
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

  const paymentsOfTable = fullNamesDecoded.filter(
    (payment) => payment.table === tableNumber
  );

  if (paymentsOfTable.length === 0) {
    return null;
  }

  return paymentsOfTable[paymentsOfTable.length - 1];
}

async function getLastPaymentOfEvent(eventId: string): Promise<Payment | null> {
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

  console.log(fullNamesDecoded);
  const paymentsOfEvent = fullNamesDecoded.filter(
    (payment) => payment.event === eventId
  );

  if (paymentsOfEvent.length === 0) {
    return null;
  }

  return paymentsOfEvent[paymentsOfEvent.length - 1];
}

export const getTableOrders = async (tableNumber: number): Promise<Order> => {
  const orders = await findAllOrders();

  const ordersOfTable = orders.filter((order) => order.table === tableNumber);

  const items: OrderItems = {};
  const itemsEvent: OrderItems = {};
  if (ordersOfTable.length === 0) {
    return {
      table: tableNumber,
      total: 0,
      items: {},
      itemsEvent: {},
      datetime: new Date(),
    };
  }

  const lastPayment = await getLastPaymentOfTable(tableNumber);
  console.log(lastPayment);
  console.log(ordersOfTable);
  const recentOrdersOfTable =
    lastPayment && lastPayment.date
      ? ordersOfTable.filter(
          (order) => new Date(order.datetime) > new Date(lastPayment.date)
        )
      : ordersOfTable;

  console.log(recentOrdersOfTable);

  recentOrdersOfTable.forEach((order: Order) => {
    console.log(order);
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

  console.log(items);
  console.log(itemsEvent);

  const order: Order = {
    table: tableNumber,
    datetime: new Date(),
    total: recentOrdersOfTable.reduce((acc, curr) => acc + curr.total, 0),
    items,
    itemsEvent,
  };

  return order;
};

export const getEventOrders = async (eventId: string): Promise<Order> => {
  const orders = await findAllOrders();

  orders.map((order) => {});

  const ordersOfEvent = orders.filter((order) => order.event === eventId);

  const items: OrderItems = {};
  const itemsEvent: OrderItems = {};
  ordersOfEvent.forEach((order: Order) => {
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

  const lastPayment = await getLastPaymentOfEvent(eventId);

  console.log(lastPayment);
  const recentOrdersOfEvent =
    lastPayment && lastPayment.date
      ? ordersOfEvent.filter(
          (order) => new Date(order.datetime) > new Date(lastPayment.date)
        )
      : ordersOfEvent;

  const order: Order = {
    event: eventId,
    datetime: new Date(),
    total: recentOrdersOfEvent.reduce((acc, curr) => acc + curr.total, 0),
    items,
    itemsEvent,
  };

  return order;
};

export function createOrder(order: Order): Promise<Order> {
  if (order.event === undefined) {
    delete order.event;
  }
  const encodedOrder = encodeObjectToBase64(order);
  return axios.post("http://localhost:9500/menu/menus", encodedOrder);
}

export async function savePayment(payment: Payment): Promise<Payment> {
  payment.date = new Date();
  const encodedPayment = encodeObjectToBase64(payment);
  return axios.post("http://localhost:9500/menu/menus", encodedPayment);
}
