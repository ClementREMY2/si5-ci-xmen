export interface TableBackend {
        _id: string,
        number: number,
        taken: boolean,
        tableOrderId: string
}

export interface TableOrderNBCustomers {
        tableNumber: number;
        customersCount: number;
}