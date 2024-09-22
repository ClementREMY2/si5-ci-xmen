export enum TableStatus {
    AVAILABLE = "AVAILABLE",
    RESERVED = "RESERVED",
    OCCUPIED = "OCCUPIED",
    ORDER_IN_PROGRESS = "ORDER_IN_PROGRESS",
    ORDER_READY = "ORDER_READY"
}

export interface Reservation {
    id?: string;
    table: number;
    nbPeople: number;
    event?: string;
    date: Date;
    status: TableStatus;
}