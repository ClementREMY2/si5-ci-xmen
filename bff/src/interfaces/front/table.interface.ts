export enum TableStatusEnum {
    AVAILABLE = "Libre",
    RESERVED = "Réservée",
    OCCUPIED = "Occupée",
    ORDER_IN_PROGRESS = "En préparation",
    ORDER_READY = "Commande prête"
}

export interface Table {
    id?: string;
    table: number;
    nbPeople: number;
    event?: string;
    status: TableStatusEnum;
}