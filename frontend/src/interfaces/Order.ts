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

export interface OrderBackend {
    _id: string,
    tableNumber: number,
    customersCount: number,
    opened: Date,
    lines: LineBackend[],
    preparations: PreparationBackend[],
    billed: null
}

export interface LineBackend {
    item: PreparedItemBackend[],
    howMany: number
}

export interface PreparationBackend {
    _id: string,
    shouldBeReadyAt: string,
    preparedItems : PreparedItemBackend[]
}

export interface PreparedItemBackend {
    _id: string,
    shortName: string
}
