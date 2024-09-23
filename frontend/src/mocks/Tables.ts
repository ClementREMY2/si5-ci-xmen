import {Table, TableStatusEnum} from "../interfaces/Table.ts";

export const tables: Table[] = [
    {
        table: 1,
        nbPeople: 2,
        status: TableStatusEnum.OCCUPIED
    },
    {
        table: 2,
        nbPeople: 4,
        status: TableStatusEnum.AVAILABLE
    },
    {
        table: 3,
        nbPeople: 5,
        status: TableStatusEnum.AVAILABLE
    },
    {
        table: 4,
        nbPeople: 5,
        status: TableStatusEnum.AVAILABLE
    },
    {
        table: 5,
        nbPeople: 6,
        status: TableStatusEnum.AVAILABLE
    },
    {
        table: 6,
        nbPeople: 2,
        status: TableStatusEnum.RESERVED
    },
    {
        table: 7,
        nbPeople: 6,
        status: TableStatusEnum.AVAILABLE
    },
    {
        table: 8,
        nbPeople: 4,
        status: TableStatusEnum.AVAILABLE
    },
    {
        table: 9,
        nbPeople: 8,
        status: TableStatusEnum.AVAILABLE
    },
    {
        table: 10,
        nbPeople: 4,
        status: TableStatusEnum.AVAILABLE
    },
    {
        table: 11,
        nbPeople: 3,
        status: TableStatusEnum.AVAILABLE
    },
    {
        table: 12,
        nbPeople: 5,
        status: TableStatusEnum.AVAILABLE
    }
];