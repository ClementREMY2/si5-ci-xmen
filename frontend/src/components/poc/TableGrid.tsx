import { Grid2 } from "@mui/material";
import TableCard from "./TableCard";

interface Table {
    tableNumber: number;
    customerNames: string[];
    totalPrices: number[];
  }

interface TableGridProps {
    tables: Table[];
    width?: string | number;
    onSelection?: (tableNumber: number) => void;
}

export default function TableGrid({tables, width = "100%", onSelection}: Readonly<TableGridProps>) {

    const handleClick = (tableNumber: number) => {
        if (onSelection) {
            onSelection(tableNumber);
        }
    }

    return (
        <Grid2 container spacing={3} overflow={"auto"} sx={{width}}>
            {tables.map(table => (
                <Grid2 key={table.tableNumber} size={4}>
                    <TableCard table={table} onClick={handleClick}/>
                </Grid2>
            ))}
        </Grid2>
    );
}