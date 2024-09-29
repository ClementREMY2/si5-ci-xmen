export interface OrderItems {
    [id: string]: number;
}

export interface Order {
    id?: string;
    table?: number;
    event?: string;
    datetime?: Date;
    total: number;
    items?: OrderItems;
    itemsEvent?: OrderItems;
}