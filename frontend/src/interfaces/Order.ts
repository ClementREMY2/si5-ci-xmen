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
    id?: number;
    table: number;
    date?: string;
    time?: string;
    status: OrderStatus;
    total: number;
    items: OrderItems;
}