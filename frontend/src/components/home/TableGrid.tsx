import {Grid2} from "@mui/material";
import {useState} from "react";
import {Table} from "../../interfaces/Table.ts";
import TableCard from "./TableCard.tsx";
import TableDialog from "./TableDialog.tsx";

interface TableGridProps {
    tables: Table[];
    handleTableChange?: (changedTable: Table) => void;
    width?: string | number;
}

export default function TableGrid({tables, handleTableChange, width}: Readonly<TableGridProps>) {
    const [selectedTable, setSelectedTable] = useState<Table | undefined>(undefined);

    const onTableClick = (table: Table) => {
        setSelectedTable(table);
    };

    const onTableReserve = (table: Table) => {
        handleTableChange?.(table);
        onClose();
    };

    const onClose = () => {
        setSelectedTable(undefined);
    };

    return (
        <Grid2 container spacing={3} overflow={"auto"} sx={{width}}>
            {tables.map(table => (
                <Grid2 key={table.id} size={4}>
                    <TableCard table={table} onClick={() => onTableClick(table)}/>
                </Grid2>
            ))}
            {selectedTable &&
                <TableDialog open={!!selectedTable} table={selectedTable} handleTableReserve={onTableReserve}
                             onClose={onClose}/>
            }
        </Grid2>
    );
}