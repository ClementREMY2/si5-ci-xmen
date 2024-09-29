export enum TableStatusEnum {
    AVAILABLE = "AVAILABLE",
    RESERVED = "RESERVED",
    OCCUPIED = "OCCUPIED",
    ORDER_IN_PROGRESS = "ORDER_IN_PROGRESS",
    ORDER_READY = "ORDER_READY"
}

export interface Table {
    id?: string;
    table: number;
    nbPeople: number;
    event?: string;
    status: TableStatusEnum;
}

export class TableWithOrderDto {
    _id?: string;
    number?: number;
    taken?: boolean;
    tableOrderId?: string; 
}