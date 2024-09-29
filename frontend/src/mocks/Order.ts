import {Order} from "../interfaces/Order.ts";

export const tableOrderMock: Order = {
    table: 8,
    datetime: new Date(),
    total: 101,
    items: {
        ["1"]: 2,
        ["2"]: 1,
        ["3"]: 1,
        ["5"]: 2,
        ["6"]: 1,
        ["10"]: 1,
        ["11"]: 1,
        ["12"]: 1,
        ["13"]: 1,
        ["16"]: 2
    }
};

export const eventOrderMock: Order = {
    event: "Avisto",
    datetime: new Date(),
    total: 133,
    items: {
        ["1"]: 1,
        ["2"]: 2,
        ["3"]: 2
    },
    itemsEvent: {
        ["1"]: 2,
        ["2"]: 1,
        ["3"]: 2
    }
};