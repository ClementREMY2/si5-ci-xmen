export interface OrderItems {
    [id: string]: number;
}

export interface Order {
    id?: string;
    table: number;
    datetime?: Date;
    total: number;
    items?: OrderItems;
    itemsEvent?: OrderItems;
}

export interface OrderDTO {
    _id: string;
    tableNumber: number;
    customersCount: number;
    opened: Date;
    lines: OrderingLineDTO[];
    preparations: PreparationDTO[];
    billed: Date;
}

export interface OrderingLineDTO {
    item: OrderingItemDTO;
    howMany: number;
    sentForPreparation: boolean;
}

export interface OrderingItemIdDTO {
    menuItemId: string,
    menuItemShortName: string,
    howMany: 1
}

export interface OrderingItemDTO {
    _id: string; 
    shortName: string;
}

export interface PreparationDTO {
    _id: string;
    tableNumber: number;
    shouldBeReadyAt: Date;
    completedAt: Date;
    takenForServiceAt: Date;
}
