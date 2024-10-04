export interface PreparedItem {
    _id: string;
    shortName: string;
    shouldStartAt: string;
    startedAt: string;
    finishedAt: string;
}

export interface Preparation {
    _id: string;
    tableNumber: number;
    shouldBeReadyAt: string;
    completedAt: string;
    takenForServiceAt: string;
    preparedItems: PreparedItem[];
}