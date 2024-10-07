import axios from 'axios';
import { Menu } from 'src/interfaces/back/menu.interface';
import { Order } from 'src/interfaces/front/order.interface';
import { Payment } from 'src/interfaces/front/payment.interface';
import { Event } from 'src/interfaces/front/event.interface';
import { Table } from 'src/interfaces/front/table.interface';
import { MenuItem } from 'src/interfaces/front/menu.interfaces';

function encodeObjectToBase64(obj: any): any {
  const jsonString = JSON.stringify(obj);
  const base64String = Buffer.from(jsonString).toString('base64');
  const menu = {
    shortName: new Date().toISOString(),
    fullName: base64String,
    price: 10,
    category: 'STARTER',
    image: 'https://null.com',
  };
  return menu;
}

function isOrder(obj: any): obj is Order {
  return (
    typeof obj.table === 'number' &&
    typeof obj.datetime === 'string' &&
    typeof obj.total === 'number' &&
    (typeof obj.items === 'object' || typeof obj.itemsEvent === 'object')
  );
}

async function saveMenu(menu: any): Promise<Menu> {
  const res: Menu = await axios
    .post('http://localhost:9500/menu/menus', menu)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(`Failed to create order: ${error.message}`);
    });
  return res;
}

function isEvent(obj: any): obj is Event {
  return (
    typeof obj.name === 'string' &&
    typeof obj.date === 'string' &&
    typeof obj.menus === 'object'
  );
}

async function findAllEvents(): Promise<Event[]> {
  const menuItems: Menu[] = await axios
    .get('http://localhost:9500/menu/menus')
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(`Failed to fetch menus: ${error.message}`);
    });

  const fullNamesDecoded = menuItems
    .map((menuItem) => {
      try {
        const decoded = Buffer.from(menuItem.fullName, 'base64').toString(
          'ascii',
        );
        const decodedObj = JSON.parse(decoded);
        decodedObj.id = menuItem._id;
        return decodedObj;
      } catch (e) {
        return null;
      }
    })
    .filter((decoded) => decoded !== null)
    .filter(isEvent);

  return fullNamesDecoded;
}

async function findAllOrders(): Promise<Order[]> {
  const menuItems: Menu[] = await axios
    .get('http://localhost:9500/menu/menus')
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(`Failed to fetch menus: ${error.message}`);
    });

  const fullNamesDecoded = menuItems
    .map((menuItem) => {
      try {
        const decoded = Buffer.from(menuItem.fullName, 'base64').toString(
          'ascii',
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

function isPayment(obj: any): obj is Payment {
  return (
    typeof obj.table === 'string' &&
    typeof obj.date === 'string' &&
    typeof obj.ended === 'boolean'
  );
}

async function getLastPaymentOfTable(tableNumber: number): Promise<Payment> {
  // const payments: Menu[] = await axios
  //   .get('http://localhost:9500/menu/menus')
  //   .then((response) => response.data)
  //   .catch((error) => {
  //     throw new Error(`Failed to fetch payments: ${error.message}`);
  //   });

  // const fullNamesDecoded = payments
  //   .map((payment) => {
  //     try {
  //       const decoded = Buffer.from(payment.fullName, 'base64').toString(
  //         'ascii',
  //       );
  //       const decodedObj = JSON.parse(decoded);
  //       decodedObj.id = payment._id;
  //       return decodedObj;
  //     } catch (e) {
  //       return null;
  //     }
  //   })
  //   .filter((decoded) => decoded !== null)
  //   .filter(isPayment);

  // const lastPayment = fullNamesDecoded.reduce((acc, payment) => {
  //   if (payment.table == tableNumber) {
  //     if (acc === null) {
  //       return payment;
  //     }
  //     if (new Date(payment.date) > new Date(acc.date)) {
  //       return payment;
  //     }
  //   }
  //   return acc;
  // }, null);

  // return lastPayment;

  const payments: Menu[] = await axios
    .get('http://localhost:9500/menu/menus')
    .then((response: { data: any }) => response.data)
    .catch((error: { message: any }) => {
      throw new Error(`Failed to fetch payments: ${error.message}`);
    });

  const fullNamesDecoded = payments
    .map((payment) => {
      try {
        const decoded = Buffer.from(payment.fullName, 'base64').toString(
          'ascii',
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
  const lastEndedPaymentIndex = fullNamesDecoded.findIndex(
    (payment) => payment.table === tableNumber && payment.ended,
  );
  console.log(lastEndedPaymentIndex);
  if (lastEndedPaymentIndex !== -1) {
    const lastEndedPayment = fullNamesDecoded[lastEndedPaymentIndex];
    return {
      ...lastEndedPayment,
      items: {},
      itemsEvent: {},
    };
  }
  const relevantPayments = fullNamesDecoded.slice(lastEndedPaymentIndex + 1);

  const accumulatedPayment = relevantPayments.reduce<Payment | null>(
    (acc, payment) => {
      if (payment.table == tableNumber) {
        if (acc === null) {
          return {
            ...payment,
            items: { ...payment.items },
            itemsEvent: { ...payment.itemsEvent },
          };
        }
        Object.entries(payment.items).forEach(([key, value]) => {
          acc.items[key] = (acc.items[key] || 0) + value;
        });
        Object.entries(payment.itemsEvent).forEach(([key, value]) => {
          acc.itemsEvent[key] = (acc.itemsEvent[key] || 0) + value;
        });
      }
      return acc;
    },
    null,
  );

  return accumulatedPayment;
}

function isTable(obj: any): obj is Table {
  return (
    typeof obj.table === 'number' &&
    typeof obj.nbPeople === 'number' &&
    typeof obj.status === 'string'
  );
}

async function findAllTables(): Promise<Table[]> {
  const menuItems: Menu[] = await axios
    .get('http://localhost:9500/menu/menus')
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(`Failed to fetch menus: ${error.message}`);
    });

  const fullNamesDecoded = menuItems
    .map((menuItem) => {
      try {
        const decoded = Buffer.from(menuItem.fullName, 'base64').toString(
          'ascii',
        );
        const decodedObj = JSON.parse(decoded);
        decodedObj.id = menuItem._id;
        return decodedObj;
      } catch (e) {
        return null;
      }
    })
    .filter((decoded) => decoded !== null)
    .filter(isTable);

  const uniqueTables = fullNamesDecoded.reduce((acc, table) => {
    const existingTable = acc.find((t) => t.table === table.table);
    if (!existingTable) {
      acc.push(table);
    } else {
      const index = acc.indexOf(existingTable);
      acc[index] = table;
    }
    return acc;
  }, []);

  return uniqueTables;
}

async function saveTable(table: Table): Promise<Table> {
  const encoded = encodeObjectToBase64(table);

  const res: Menu = await saveMenu(encoded);

  table.id = res._id;
  return table;
}

async function findTable(tableNumber: number): Promise<Table> {
  const tables = await findAllTables();
  return tables.find((table) => table.table == tableNumber);
}

// export interface GenericMenuItem {
//     id?: string;
//     fullName: string;
//     shortName: string;
//     price: number;
// }

function isMenuItem(obj: any): obj is MenuItem {
  return (
    typeof obj.fullName === 'string' &&
    typeof obj.price === 'number' &&
    typeof obj.shortName === 'string' &&
    typeof obj.category === 'string'
  );
}

async function findAllMenus(): Promise<MenuItem[]> {
  const menuItems: Menu[] = await axios
    .get('http://localhost:9500/menu/menus')
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(`Failed to fetch menus: ${error.message}`);
    });

  const fullNamesDecoded = menuItems
    .map((menuItem) => {
      try {
        const decoded = Buffer.from(menuItem.fullName, 'base64').toString(
          'ascii',
        );
        const decodedObj = JSON.parse(decoded);
        decodedObj.id = menuItem._id;
        return decodedObj;
      } catch (e) {
        return null;
      }
    })
    .filter((decoded) => decoded !== null)
    .filter(isMenuItem);

  const uniqueMenuItems = fullNamesDecoded.reduce((acc, menuItem) => {
    const existingMenuItem = acc.find(
      (item) => item.shortName === menuItem.shortName,
    );
    if (!existingMenuItem) {
      acc.push(menuItem);
    } else {
      const index = acc.indexOf(existingMenuItem);
      acc[index] = menuItem;
    }
    return acc;
  }, []);

  return uniqueMenuItems;

  return fullNamesDecoded;
}
export {
  encodeObjectToBase64,
  saveMenu,
  findAllOrders,
  getLastPaymentOfTable,
  findAllEvents,
  findAllTables,
  saveTable,
  findTable,
  findAllMenus,
};
