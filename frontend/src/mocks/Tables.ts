import {Table, TableStatusEnum} from "../interfaces/Table.ts";

export const tablesMock: Table[] = [
    {
        id: "1",
        table: 1,
        nbPeople: 2,
        status: TableStatusEnum.AVAILABLE,
        event: "Avisto"
    },
    {
        id: "2",
        table: 2,
        nbPeople: 4,
        status: TableStatusEnum.RESERVED,
        event: "Avisto"
    },
    {
        id: "3",
        table: 3,
        nbPeople: 5,
        status: TableStatusEnum.OCCUPIED
    },
    {
        id: "4",
        table: 4,
        nbPeople: 5,
        status: TableStatusEnum.ORDER_IN_PROGRESS,
        event: "SAP"
    },
    {
        id: "5",
        table: 5,
        nbPeople: 6,
        status: TableStatusEnum.ORDER_READY,
        event: "Air France"
    },
    {
        id: "6",
        table: 6,
        nbPeople: 2,
        status: TableStatusEnum.AVAILABLE
    },
    {
        id: "7",
        table: 7,
        nbPeople: 6,
        status: TableStatusEnum.RESERVED
    },
    {
        id: "8",
        table: 8,
        nbPeople: 4,
        status: TableStatusEnum.OCCUPIED
    },
    {
        id: "9",
        table: 9,
        nbPeople: 8,
        status: TableStatusEnum.ORDER_IN_PROGRESS
    },
    {
        id: "10",
        table: 10,
        nbPeople: 4,
        status: TableStatusEnum.ORDER_READY
    },
    {
        id: "11",
        table: 11,
        nbPeople: 3,
        status: TableStatusEnum.AVAILABLE
    },
    {
        id: "12",
        table: 12,
        nbPeople: 5,
        status: TableStatusEnum.RESERVED
    },
    {
        id: "13",
        table: 13,
        nbPeople: 5,
        status: TableStatusEnum.OCCUPIED
    },
    {
        id: "14",
        table: 14,
        nbPeople: 5,
        status: TableStatusEnum.ORDER_IN_PROGRESS
    },
    {
        id: "15",
        table: 15,
        nbPeople: 6,
        status: TableStatusEnum.ORDER_READY
    },
    {
        id: "16",
        table: 16,
        nbPeople: 2,
        status: TableStatusEnum.AVAILABLE
    },
    {
        id: "17",
        table: 17,
        nbPeople: 6,
        status: TableStatusEnum.RESERVED
    },
    {
        id: "18",
        table: 18,
        nbPeople: 4,
        status: TableStatusEnum.OCCUPIED
    },
    {
        id: "19",
        table: 19,
        nbPeople: 8,
        status: TableStatusEnum.ORDER_IN_PROGRESS
    },
    {
        id: "20",
        table: 20,
        nbPeople: 4,
        status: TableStatusEnum.ORDER_READY
    }
];