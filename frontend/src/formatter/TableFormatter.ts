import { useEffect } from "react";
import { useState} from "react";
import "../index.css";
import { getTables, getTablesOrders, updateTableOrder, updateTable as updateTableService } from '../services/DiningService.ts'
import { TableOrderDTO, Table, TableStatusEnum, TableWithOrderDto } from "../interfaces/Table.ts"
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
}

const useFetchTables = () => {
        const [tables, setTables] = useState<Table[]>([]);
        const [error, setError] = useState<string | null>(null);
        const [loading, setLoading] = useState<boolean>(true);

        useEffect(() => {
          const fetchTables = async () => {
            try {
              const dataDTO = await getTables();
              const dataFront = transformTableData(dataDTO);  
              setTables(dataFront); 
            } catch (error: any) {
              setError('Erreur lors de la récupération des tables.');
              console.error(error.message);
            } finally {
              setLoading(false);  
            }
          };

          fetchTables();
        }, []);

        let dataFront: OrderDTO[] = [];

        useEffect(() => {
                async () => {
                  try {
                    const dataDTO = await getTablesOrders();
                    dataFront = dataDTO;
                  } catch (error: any) {
                    setError('Erreur lors de la récupération des tables.');
                    console.error(error.message);
                  } finally {
                    setLoading(false);  
                  }
                };
        }, []);

        for (const table of tables) {
                for (const order of dataFront) {
                        if (table.table === order.tableNumber) {
                                table.nbPeople = order.customersCount;
                                for (const line of order.lines) {
                                        table.event = line.item.shortName;
                                }
                        }
                }                
        }

        return { tables, error, loading };
};


export const postUpdateTable = async (table: Table, event: string ) => {
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
        }
        else {
                const orderingItem: OrderingItemIdDTO = {
                        menuItemId: event,
                        menuItemShortName: event,
                        howMany: 1
                }
                try {
                        console.log(orderingItem);
                        await updateTableOrder(table.table, orderingItem);
                } catch (error) {
                        console.error('Erreur lors de la mise à jour de la table:', error);
                        throw error;
                }
        }
}


export default useFetchTables;
