import axios from "axios";
import { Payment } from "../interfaces/payment.interface";
import { Order, OrderItems } from "../interfaces/Order";
import { Buffer } from "buffer";

const isUsingBFF = import.meta.env.VITE_APP_IS_USING_BFF === "true";

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

const getTableOrdersBFF = async (tableNumber: number): Promise<Order> => {
  var config = {
    method: "get",
    url:
      "http://localhost:3003/orders-64/bill/table?tableNumber=" + tableNumber,
    headers: {},
  };

  const response = axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  return response;
};

export const getTableOrders = async (tableNumber: number): Promise<Order> => {
  if (isUsingBFF) {
    const o = await getTableOrdersBFF(tableNumber);
    return o;
  }

  const lastPaymentOfTable = await getLastPaymentOfTable(tableNumber);

  const orders = await findAllOrders();

  console.log("lastPaymentOfTable", JSON.stringify(lastPaymentOfTable));
  console.log("orders", JSON.stringify(orders));

  const ordersOfTable: Order[] = orders.filter(
    (order) =>
      order.table == tableNumber &&
      (!lastPaymentOfTable ||
        (order.datetime &&
          order.datetime > lastPaymentOfTable.date &&
          !lastPaymentOfTable.ended))
  );
  const items: OrderItems = {};
  const itemsEvent: OrderItems = {};
  let total: number = 0;
  console.log("ordersOfTable", JSON.stringify(ordersOfTable));
  ordersOfTable.forEach((order: Order) => {
    total += order.total;
    if (order.items) {
      Object.entries(order.items).forEach(([itemId, quantity]) => {
        if (items[itemId]) {
          items[itemId] += quantity;
        } else {
          items[itemId] = quantity;
        }
      });
      if (
        lastPaymentOfTable &&
        lastPaymentOfTable.items &&
        !lastPaymentOfTable.ended
      ) {
        Object.entries(lastPaymentOfTable.items).forEach(
          ([itemId, quantity]) => {
            if (items[itemId]) {
              items[itemId] -= quantity;
            }
          }
        );
      }
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
    if (
      lastPaymentOfTable &&
      lastPaymentOfTable.itemsEvent &&
      !lastPaymentOfTable.ended
    ) {
      Object.entries(lastPaymentOfTable.itemsEvent).forEach(
        ([itemId, quantity]) => {
          if (itemsEvent[itemId]) {
            itemsEvent[itemId] -= quantity;
          }
        }
      );
    }
  });

  if (ordersOfTable.length === 0) {
    return { table: tableNumber, total: 0, items: {}, itemsEvent: {} };
  }

  console.log(
    "order",
    JSON.stringify({ table: tableNumber, total, items, itemsEvent })
  );
  const order: Order = {
    table: ordersOfTable[0].table,
    items,
    itemsEvent,
    total,
  };

  return order;
};

export const getEventOrders = async (eventId: string): Promise<Order> => {
  const orders = await findAllOrders();

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
};

export function createOrder(order: Order): Promise<Order> {
  if (isUsingBFF) {
    return axios.post("http://localhost:3003/orders-64", order);
  }
  if (order.event === undefined) {
    delete order.event;
  }
  const encodedOrder = encodeObjectToBase64(order);
  return axios.post("http://localhost:9500/menu/menus", encodedOrder);
}

export async function savePayment(payment: Payment): Promise<Payment> {
  if (isUsingBFF) {
    return axios.post("http://localhost:3003/payments", payment);
  }
  const lastPayment = await getLastPaymentOfTable(payment.table);
  if (lastPayment && !lastPayment.ended) {
    Object.entries(lastPayment.items).forEach(([itemId, quantity]) => {
      if (payment.items[itemId]) {
        payment.items[itemId] += quantity;
      }
    });
  }
  if (lastPayment && !lastPayment.ended) {
    Object.entries(lastPayment.itemsEvent).forEach(([itemId, quantity]) => {
      if (payment.itemsEvent[itemId]) {
        payment.itemsEvent[itemId] += quantity;
      }
    });
  }
  const encodedPayment = encodeObjectToBase64(payment);
  return axios.post("http://localhost:9500/menu/menus", encodedPayment);
}
