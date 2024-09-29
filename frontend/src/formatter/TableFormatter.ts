import { useEffect } from "react";
import { useState} from "react";
import "../index.css";
import { getTables } from '../services/DiningService.ts'
import { Table, TableStatusEnum, TableWithOrderDto } from "../interfaces/Table.ts"

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

export const updateTable = (table: Table) => {
        console.log("Table updated:", table);
}

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

        return { tables, error, loading };
};


export default useFetchTables;
