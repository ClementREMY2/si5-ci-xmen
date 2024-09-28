import {Button, Dialog, Stack, Typography} from "@mui/material";
import {useState} from "react";
import {Table} from "../../interfaces/Table.ts";
import ReservationMainContent from "./ReservationMainContent.tsx";

interface ReservationDialogProps {
    open: boolean;
    table: Table;
    handleTableReserve?: (changedTable: Table) => void;
    onClose: () => void;
}

export default function TableDialog({
    open,
    table,
    handleTableReserve = () => {},
    onClose
}: Readonly<ReservationDialogProps>) {
    const [changedTable, setChangedTable] = useState<Table>(table);

    const handleChange = (key: keyof Table, value: string | number | undefined) => {
        setChangedTable({...changedTable, [key]: value});
    };

    return (
        <Dialog open={open} onClose={onClose}>
            {table && <Stack spacing={2} margin={2} alignItems={"center"}>
                <Typography variant={"h4"}>{`Réserver la table ${table.table}`}</Typography>
                <ReservationMainContent table={changedTable} handleChange={handleChange}/>
                <Button onClick={() => handleTableReserve(changedTable)} variant={"contained"} sx={{width: "200px"}}>
                    Réserver
                </Button>
            </Stack>}
        </Dialog>
    );
}