import { PreparedItem } from "src/interfaces/back/kitchen.interfaces";
import { Order, OrderItems } from "src/interfaces/front/order.interface";
import { Menu } from "src/interfaces/back/menu.interface";

export function getOrderItems(preparedItems: PreparedItem[]): OrderItems {
    const items: OrderItems = {};
    preparedItems.forEach((item) => {
        items[item._id] = 1;
    });
    return items;
}

export function getLastOrderOfATable(menuItems: Menu[], tableNumber: number): Order {
    const ordersRaw: Menu[] = [];

    menuItems.forEach((menu) => {
        const isOrder = menu.fullName.split('|')[0] === 'order';
        const table = menu.fullName.split('|')[1];
        if (isOrder && parseInt(table) == tableNumber) {
            ordersRaw.push(menu);
        }
    });

    const orders: Order[] = [];

    ordersRaw.forEach((order) => {
        const itemsId = order.fullName.split('|')[3];
        const eventId = order.fullName.split('|')[2];
        const itemsEventId = order.fullName.split('|')[4];

        const items: { [key: string]: number } = {};
        const itemsEvent: { [key: string]: number } = {};

        menuItems.forEach((menu) => {
            if(menu.fullName.split('|')[0] === 'itemsOrder'){
                if(menu._id === itemsId){
                    const parts = menu.fullName.split('|');
                    parts.shift();
                    for(let i = 0; i < parts.length; i+=2){
                        items[parts[i]] = parseInt(parts[i+1]);
                    }
                }
            }
            else if(menu.fullName.split('|')[0] === 'itemsEvent'){
                if(menu._id === itemsEventId){
                    const parts = menu.fullName.split('|');
                    parts.shift();
                    for(let i = 0; i < parts.length; i+=2){
                        itemsEvent[parts[i]] = parseInt(parts[i+1]);
                    }
                }
            }
        });


        const orderDate = new Date(order.shortName.split('|')[1]);
        const tableNumber = parseInt(order.fullName.split('|')[1]);
        orders.push({
            table: tableNumber,
            items,
            itemsEvent,
            datetime: orderDate,
            event: eventId,
            total: order.price
        });
        
    });


    return orders
        .filter(order => !isNaN(order.datetime.getTime()))
        .sort((a, b) => b.datetime.getTime() - a.datetime.getTime())[0];
}

export function getLastOrderOfATableForEvent(menuItems: Menu[], tableNumber: number, eventId: string): Order {
    const ordersRaw: Menu[] = [];

    menuItems.forEach((menu) => {
        const isOrder = menu.fullName.split('|')[0] === 'order';
        const table = menu.fullName.split('|')[1];
        const event = menu.fullName.split('|')[2];
        if (isOrder && parseInt(table) == tableNumber && event === eventId) {
            ordersRaw.push(menu);
        }
    });

    const orders: Order[] = [];

    ordersRaw.forEach((order) => {
        const itemsId = order.fullName.split('|')[3];
        const itemsEventId = order.fullName.split('|')[4];

        const items: { [key: string]: number } = {};
        const itemsEvent: { [key: string]: number } = {};

        menuItems.forEach((menu) => {
            if (menu.fullName.split('|')[0] === 'itemsOrder' && menu._id === itemsId) {
                const parts = menu.fullName.split('|');
                parts.shift();
                for (let i = 0; i < parts.length; i += 2) {
                    items[parts[i]] = parseInt(parts[i + 1]);
                }
            } else if (menu.fullName.split('|')[0] === 'itemsEvent' && menu._id === itemsEventId) {
                const parts = menu.fullName.split('|');
                parts.shift();
                for (let i = 0; i < parts.length; i += 2) {
                    itemsEvent[parts[i]] = parseInt(parts[i + 1]);
                }
            }
        });

        const orderDate = new Date(order.shortName.split('|')[1]);
        orders.push({
            table: tableNumber,
            items,
            itemsEvent,
            datetime: orderDate,
            event: eventId,
            total: order.price
        });
    });

    return orders
        .filter(order => !isNaN(order.datetime.getTime()))
        .sort((a, b) => b.datetime.getTime() - a.datetime.getTime())[0];
}

export function getLastOrderForEvent(menuItems: Menu[], eventId: string): Order {
    const ordersRaw: Menu[] = [];

    menuItems.forEach((menu) => {
        const isOrder = menu.fullName.split('|')[0] === 'order';
        const event = menu.fullName.split('|')[2];
        if (isOrder && event === eventId) {
            ordersRaw.push(menu);
        }
    });




    const orders: Order[] = [];

    ordersRaw.forEach((order) => {
        const itemsId = order.fullName.split('|')[3];
        const itemsEventId = order.fullName.split('|')[4];

        const items: { [key: string]: number } = {};
        const itemsEvent: { [key: string]: number } = {};

        menuItems.forEach((menu) => {
            if (menu.fullName.split('|')[0] === 'itemsOrder' && menu._id === itemsId) {
                const parts = menu.fullName.split('|');
                parts.shift();
                for (let i = 0; i < parts.length; i += 2) {
                    items[parts[i]] = parseInt(parts[i + 1]);
                }
            } else if (menu.fullName.split('|')[0] === 'itemsEvent' && menu._id === itemsEventId) {
                const parts = menu.fullName.split('|');
                parts.shift();
                for (let i = 0; i < parts.length; i += 2) {
                    itemsEvent[parts[i]] = parseInt(parts[i + 1]);
                }
            }
        });

        const orderDate = new Date(order.shortName.split('|')[1]);
        orders.push({
            table: parseInt(order.fullName.split('|')[1]),
            items,
            itemsEvent,
            datetime: orderDate,
            event: eventId,
            total: order.price
        });
    });

    return orders
        .filter(order => !isNaN(order.datetime.getTime()))
        .sort((a, b) => b.datetime.getTime() - a.datetime.getTime())[0];
}

export function concatAllOrdersOfATableInOne(menunItems: Menu[], tableNumber: number): Order {
    const ordersRaw: Menu[] = [];

    const fromDate = getDateOfLastPayment(menunItems, tableNumber);

    if (fromDate) {
        menunItems = menunItems.filter(menu => {
            const isOrder = menu.fullName.split('|')[0] === 'order';
            const orderDate = new Date(menu.shortName.split('|')[1]);
            return !isOrder || orderDate <= fromDate;
        });
    }

    menunItems.forEach((menu) => {
        const isOrder = menu.fullName.split('|')[0] === 'order';
        const table = menu.fullName.split('|')[1];
        if (isOrder && parseInt(table) == tableNumber) {
            ordersRaw.push(menu);
        }
    });

    const combinedItems: { [key: string]: number } = {};
    const combinedItemsEvent: { [key: string]: number } = {};
    let total = 0;

    ordersRaw.forEach((order) => {
        const itemsId = order.fullName.split('|')[3];
        const itemsEventId = order.fullName.split('|')[4];

        menunItems.forEach((menu) => {
            if (menu.fullName.split('|')[0] === 'itemsOrder' && menu._id === itemsId) {
                const parts = menu.fullName.split('|');
                parts.shift();
                for (let i = 0; i < parts.length; i += 2) {
                    const itemId = parts[i];
                    const itemCount = parseInt(parts[i + 1]);
                    combinedItems[itemId] = (combinedItems[itemId] || 0) + itemCount;
                }
            } else if (menu.fullName.split('|')[0] === 'itemsEvent' && menu._id === itemsEventId) {
                const parts = menu.fullName.split('|');
                parts.shift();
                for (let i = 0; i < parts.length; i += 2) {
                    const itemId = parts[i];
                    const itemCount = parseInt(parts[i + 1]);
                    combinedItemsEvent[itemId] = (combinedItemsEvent[itemId] || 0) + itemCount;
                }
            }
        });

        total += order.price;
    });

    const orderDates = ordersRaw.map(order => new Date(order.shortName.split('|')[1])).filter(date => !isNaN(date.getTime()));
    const orderDate = orderDates.length > 0 ? orderDates.sort((a, b) => b.getTime() - a.getTime())[0] : new Date();

    return {
        table: tableNumber,
        items: combinedItems,
        itemsEvent: combinedItemsEvent,
        datetime: orderDate,
        event: 'combined',
        total: total
    };
}

export function concatAllOrdersForEventInOne(menuItems: Menu[], eventId: string): Order {
    const ordersRaw: Menu[] = [];

    menuItems.forEach((menu) => {
        const isOrder = menu.fullName.split('|')[0] === 'order';
        const event = menu.fullName.split('|')[2];
        if (isOrder && event === eventId) {
            ordersRaw.push(menu);
        }
    });

    const combinedItems: { [key: string]: number } = {};
    const combinedItemsEvent: { [key: string]: number } = {};
    let total = 0;

    ordersRaw.forEach((order) => {
        const itemsId = order.fullName.split('|')[3];
        const itemsEventId = order.fullName.split('|')[4];

        menuItems.forEach((menu) => {
            if (menu.fullName.split('|')[0] === 'itemsOrder' && menu._id === itemsId) {
                const parts = menu.fullName.split('|');
                parts.shift();
                for (let i = 0; i < parts.length; i += 2) {
                    const itemId = parts[i];
                    const itemCount = parseInt(parts[i + 1]);
                    combinedItems[itemId] = (combinedItems[itemId] || 0) + itemCount;
                }
            } else if (menu.fullName.split('|')[0] === 'itemsEvent' && menu._id === itemsEventId) {
                const parts = menu.fullName.split('|');
                parts.shift();
                for (let i = 0; i < parts.length; i += 2) {
                    const itemId = parts[i];
                    const itemCount = parseInt(parts[i + 1]);
                    combinedItemsEvent[itemId] = (combinedItemsEvent[itemId] || 0) + itemCount;
                }
            }
        });

        total += order.price;
    });

    const orderDates = ordersRaw.map(order => new Date(order.shortName.split('|')[1])).filter(date => !isNaN(date.getTime()));
    const orderDate = orderDates.length > 0 ? orderDates.sort((a, b) => b.getTime() - a.getTime())[0] : new Date();

    return {
        table: null,
        items: combinedItems,
        itemsEvent: combinedItemsEvent,
        datetime: orderDate,
        event: eventId,
        total: total
    };
}

export function concatAllOrdersOfATableForEventInOne(menuItems: Menu[], tableNumber: number, eventId: string): Order {
    const ordersRaw: Menu[] = [];

    const fromDate = getDateOfLastPayment(menuItems, tableNumber);

    if (fromDate) {
        menuItems = menuItems.filter(menu => {
            const isOrder = menu.fullName.split('|')[0] === 'order';
            const orderDate = new Date(menu.shortName.split('|')[1]);
            return !isOrder || orderDate <= fromDate;
        });
    }

    menuItems.forEach((menu) => {
        const isOrder = menu.fullName.split('|')[0] === 'order';
        const table = menu.fullName.split('|')[1];
        const event = menu.fullName.split('|')[2];
        if (isOrder && parseInt(table) == tableNumber && event === eventId) {
            ordersRaw.push(menu);
        }
    });

    const combinedItems: { [key: string]: number } = {};
    const combinedItemsEvent: { [key: string]: number } = {};
    let total = 0;

    ordersRaw.forEach((order) => {
        const itemsId = order.fullName.split('|')[3];
        const itemsEventId = order.fullName.split('|')[4];

        menuItems.forEach((menu) => {
            if (menu.fullName.split('|')[0] === 'itemsOrder' && menu._id === itemsId) {
                const parts = menu.fullName.split('|');
                parts.shift();
                for (let i = 0; i < parts.length; i += 2) {
                    const itemId = parts[i];
                    const itemCount = parseInt(parts[i + 1]);
                    combinedItems[itemId] = (combinedItems[itemId] || 0) + itemCount;
                }
            } else if (menu.fullName.split('|')[0] === 'itemsEvent' && menu._id === itemsEventId) {
                const parts = menu.fullName.split('|');
                parts.shift();
                for (let i = 0; i < parts.length; i += 2) {
                    const itemId = parts[i];
                    const itemCount = parseInt(parts[i + 1]);
                    combinedItemsEvent[itemId] = (combinedItemsEvent[itemId] || 0) + itemCount;
                }
            }
        });

        total += order.price;
    });

    const orderDates = ordersRaw.map(order => new Date(order.shortName.split('|')[1])).filter(date => !isNaN(date.getTime()));
    const orderDate = orderDates.length > 0 ? orderDates.sort((a, b) => b.getTime() - a.getTime())[0] : new Date();

    return {
        table: tableNumber,
        items: combinedItems,
        itemsEvent: combinedItemsEvent,
        datetime: orderDate,
        event: eventId,
        total: total
    };
}

function getDateOfLastPayment(menuItems: Menu[], tableNumber: number): Date {
    const payment = menuItems.find(menu => menu.fullName.split('|')[0] === 'payment' && parseInt(menu.fullName.split('|')[1]) == tableNumber);
    return payment ? new Date(payment.shortName.split('|')[1]) : null;
}