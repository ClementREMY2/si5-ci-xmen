import {Grid2} from "@mui/material";
import {useState} from "react";
import {toast} from "react-toastify";
import {Table} from "../../interfaces/Table.ts";
import TableCard from "./TableCard.tsx";
import TableDialog from "./TableDialog.tsx";

interface TableGridProps {
    tables: Table[];
    handleTableModify?: (modifiedTable: Table) => void;
    width?: string | number;
}

export default function TableGrid({tables, handleTableModify, width}: Readonly<TableGridProps>) {
    const [selectedTable, setSelectedTable] = useState<Table | undefined>(undefined);

    const onTableClick = (table: Table) => {
        setSelectedTable(table);
    };

    const onTableModify = (table: Table) => {
        handleTableModify?.(table);
        toast.success(`Table ${table.table} modifiée avec succès`, {theme: "dark"});
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
                <TableDialog open={!!selectedTable} table={selectedTable} handleTableModify={onTableModify}
                             onClose={onClose}/>
            }
        </Grid2>
    );
}