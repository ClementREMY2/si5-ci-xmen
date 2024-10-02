import axios from "axios";
import { Menu } from "src/interfaces/back/menu.interface";
import { Order } from "src/interfaces/front/order.interface";
import { Payment } from "src/interfaces/front/payment.interface";
import { Event } from "src/interfaces/front/event.interface";


function encodeObjectToBase64(obj: any): any {
    const jsonString = JSON.stringify(obj);
    const base64String = Buffer.from(jsonString).toString('base64');
    const menu = {
        shortName: new Date().toISOString(),
        fullName: base64String,
        price: 10,
        category: "STARTER",
        image: "https://null.com"
    };
    return menu;
}

function isOrder(obj: any): obj is Order {
    return (
        typeof obj.table === 'number' &&
        typeof obj.event === 'string' &&
        typeof obj.datetime === 'string'  &&
        typeof obj.total === 'number' &&
        typeof obj.items === 'object' &&
        typeof obj.itemsEvent === 'object'
    );
}


async function saveMenu(menu: any): Promise<Menu> {
    const res: Menu = await axios.post('http://localhost:9500/menu/menus', menu)
        .then(response => response.data)
        .catch(error => {
            throw new Error(`Failed to create order: ${error.message}`);
        });
    return res;
}


function isEvent(obj: any): obj is Event {

    console.log("obj", obj)
    console.log("name", typeof obj.name === 'string' )
    console.log("date", typeof obj.date === 'string' )
    console.log("menus", typeof obj.menus === 'object' , obj.menus)

    return (
        typeof obj.name === 'string' &&
        typeof obj.date === 'string' &&
        typeof obj.menus === 'object' 
    );
}

async function findAllEvents() : Promise<Event[]> {
    const menuItems: Menu[] = await axios.get('http://localhost:9500/menu/menus')
    .then(response => response.data)
    .catch(error => {
        throw new Error(`Failed to fetch menus: ${error.message}`);
    });

    const fullNamesDecoded = menuItems.map((menuItem) => {
        try {
            const decoded = Buffer.from(menuItem.fullName, 'base64').toString('ascii');
            const decodedObj = JSON.parse(decoded);
            decodedObj.id = menuItem._id;
            return decodedObj;
        }
        catch (e) {
            return null;
        }
    }).filter((decoded) => decoded !== null).filter(isEvent);

    return fullNamesDecoded;

}

async function findAllOrders() : Promise<Order[]> {
    const menuItems: Menu[] = await axios.get('http://localhost:9500/menu/menus')
        .then(response => response.data)
        .catch(error => {
            throw new Error(`Failed to fetch menus: ${error.message}`);
        });

    const fullNamesDecoded = menuItems.map((menuItem) => {
        try {
            const decoded = Buffer.from(menuItem.fullName, 'base64').toString('ascii');
            const decodedObj = JSON.parse(decoded);
            decodedObj.id = menuItem._id;
            return decodedObj;
        }
        catch (e) {
            return null;
        }
    }).filter((decoded) => decoded !== null);


    const ordersTyped = fullNamesDecoded.filter(isOrder);

    return ordersTyped;
}

function isPayment(obj: any): obj is Payment {
    return (
        typeof obj.table === 'number' &&
        typeof obj.date === 'string' &&
        typeof obj.payment === 'boolean'
    );
}

async function getLastPaymentOfTable(tableNumber: number): Promise<Payment> {
    const payments: Menu[] = await axios.get('http://localhost:9500/menu/menus')
        .then(response => response.data)
        .catch(error => {
            throw new Error(`Failed to fetch payments: ${error.message}`);
        });

    const fullNamesDecoded = payments.map((payment) => {
        try {
            const decoded = Buffer.from(payment.fullName, 'base64').toString('ascii');
            const decodedObj = JSON.parse(decoded);
            decodedObj.id = payment._id;
            return decodedObj;
        }
        catch (e) {
            return null;
        }
    }).filter((decoded) => decoded !== null).filter(isPayment);

    const lastPayment = fullNamesDecoded.reduce((acc, payment) => {
        if (payment.table == tableNumber) {
            if (acc === null) {
                return payment;
            }
            if (new Date(payment.date) > new Date(acc.date)) {
                return payment;
            }
        }
        return acc;
    }, null);

    return lastPayment;
    
}

export { encodeObjectToBase64, saveMenu, findAllOrders, getLastPaymentOfTable, findAllEvents };