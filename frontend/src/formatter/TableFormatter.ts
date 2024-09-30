import { useEffect, useState } from "react";
import "../index.css";
import { getTables, getTablesOrders, updateOrderingItemIdDTO, updateTable as updateTableService } from '../services/DiningService.ts';
import { TableOrderDTO, Table, TableStatusEnum, TableWithOrderDto } from "../interfaces/Table.ts";
import { Order, OrderDTO, OrderingItemIdDTO } from "../interfaces/Order.ts";

export const applyTableColors = (table: Table) => {
    if (table.status === TableStatusEnum.ORDER_IN_PROGRESS) {
        return "var(--waiting-table)";
    } else if (table.status === TableStatusEnum.RESERVED) {
        return "var(--booked-table)";
    } else if (table.status === TableStatusEnum.OCCUPIED) {
        return "var(--in-use-table)";
    } else if (table.status === TableStatusEnum.AVAILABLE) {
        return "var(--free-table)";
    } else if (table.status === TableStatusEnum.ORDER_READY) {
        return "var(--ready-table)";
    } else {
        return "#9e9e9e";
    }
};

const transformTableData = (dto: TableWithOrderDto[]): Table[] => {
    return dto.map((tableDto) => {
        let status: TableStatusEnum;
        if (!tableDto.taken) {
            status = TableStatusEnum.AVAILABLE;
        } else if (tableDto.tableOrderId) {
            status = TableStatusEnum.ORDER_IN_PROGRESS;
        } else {
            status = TableStatusEnum.OCCUPIED;
        }

        const table: Table = {
            id: "" + tableDto.number,
            table: tableDto.number ?? 0,
            nbPeople: 4,
            status: status
        };

        return table;
    });
};

const transformTableOrderData = (dto: OrderDTO[]): Order[] => {
    return dto.map((tableDto) => {
        const order: Order = {
            id: tableDto._id,
            table: tableDto.tableNumber,
            datetime: tableDto.opened,
            total: tableDto.preparations.length,
            items: undefined,
            itemsEvent: undefined,
        };

        return order;
    });
};

const useFetchTables = () => {
    const [tables, setTables] = useState<Table[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTablesAndOrders = async () => {
            setLoading(true);
            try {
                const [tableDataDTO, tableOrdersDTO] = await Promise.all([getTables(), getTablesOrders()]);
                
                const transformedTables = transformTableData(tableDataDTO);
                const transformedOrders = transformTableOrderData(tableOrdersDTO);

                const mergedTables = transformedTables.map(table => {
                    const order = transformedOrders.find(order => order.table === table.table);
                    if (order) {
                        table.nbPeople = tableOrdersDTO.find(order => order.tableNumber === table.table)?.customersCount ?? 0;
                        if (order.items && order.items.length > 0) {
                            table.event = tableOrdersDTO.find(order => order.tableNumber === table.table)?.lines[0].item.shortName ?? "";
                        }
                    }
                    return table;
                });

                setTables(mergedTables);
            } catch (error: any) {
                setError('Erreur lors de la récupération des tables.');
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTablesAndOrders();
    }, []); 

    return { tables, error, loading };
};

export const postUpdateTable = async (table: Table, event: "") => {
    if (event === null) {
        const tableDTO: TableOrderDTO = {
            tableNumber: table.table,
            customersCount: table.nbPeople
        };
        try {
            console.log(tableDTO);
            await updateTableService(tableDTO);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la table:', error);
            throw error;
        }
    } else {
        const orderingItem: OrderingItemIdDTO = {
            menuItemId: event,
            menuItemShortName: event,
            howMany: 1
        };
        try {
            console.log(orderingItem);
            await updateOrderingItemIdDTO(Number(table.id), orderingItem);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la table:', error);
            throw error;
        }
    }
};

export default useFetchTables;
