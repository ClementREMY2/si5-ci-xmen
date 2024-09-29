import {eventsMock} from "../mocks/Event.ts";
import {tablesMock} from "../mocks/Tables.ts";

export const checkTableNumber = (tableNumber?: string, logs: boolean = true): boolean => {
    if (tableNumber === undefined || isNaN(parseFloat(tableNumber))) {
        if (logs) console.warn("No table specified, redirecting to home page");
        return false;
    } else if (!tablesMock.some(table => table.id === tableNumber)) {
        if (logs) console.warn("No table found for table number:", tableNumber, "=> redirecting to home page");
        return false;
    }
    return true;
};

export const checkEventName = (eventName?: string, logs: boolean = true): boolean => {
    if (eventName === undefined) {
        if (logs) console.warn("No event specified, redirecting to home page");
        return false;
    } else if (!eventsMock.some(event => event.name === eventName)) {
        if (logs) console.warn("No event found for name:", eventName, "=> redirecting to home page");
        return false;
    }
    return true;
};