import {Grid2} from "@mui/material";
import {useState} from "react";
import {toast} from "react-toastify";
import {Table} from "../../interfaces/Table.ts";
import TableCard from "./TableCard.tsx";
import TableDialog from "./TableDialog.tsx";
import {applyTableColors} from "../../formatter/TableFormatter.ts";
import {postUpdateTable} from "../../formatter/TableFormatter.ts";

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

    const onTableModify = (modifiedTable: Table) => {
        handleTableModify?.(modifiedTable);
        setSelectedTable(modifiedTable);
        toast.success(`Table ${modifiedTable.table} modifiée avec succès`, {theme: "dark"});
        applyTableColors(modifiedTable);
        postUpdateTable(modifiedTable, "");
        if (modifiedTable.event != undefined && modifiedTable.event != "") {
            postUpdateTable(modifiedTable, modifiedTable.event);
        }
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