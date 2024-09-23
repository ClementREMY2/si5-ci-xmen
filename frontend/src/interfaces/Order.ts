export enum OrderStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
    RECEIVED = "RECEIVED"
}

export interface OrderItems {
    [id: string]: number;
}

export interface Order {
    id?: string;
    table: number;
    datetime?: Date;
    status: OrderStatus;
    total: number;
    items?: OrderItems;
    itemsEvent?: OrderItems;
}