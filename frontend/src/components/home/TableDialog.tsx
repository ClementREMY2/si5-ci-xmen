import {Button, Dialog, Stack, Typography} from "@mui/material";
import {useState} from "react";
import {Table} from "../../interfaces/Table.ts";
import ModifyTableMainContent from "./ModifyTableMainContent.tsx";

interface ReservationDialogProps {
    open: boolean;
    table: Table;
    handleTableModify?: (changedTable: Table) => void;
    onClose: () => void;
}

export default function TableDialog({
    open,
    table,
    handleTableModify = () => {},
    onClose
}: Readonly<ReservationDialogProps>) {
    const [modifiedTable, setModifiedTable] = useState<Table>(table);

    const handleChange = (key: keyof Table, value: string | number | undefined) => {
        setModifiedTable({...modifiedTable, [key]: value});
    };

    return (
        <Dialog open={open} onClose={onClose}>
            {table && <Stack spacing={2} margin={2} alignItems={"center"}>
                <Typography variant={"h4"}>{`Modifier la table ${table.table}`}</Typography>
                <ModifyTableMainContent table={modifiedTable} handleChange={handleChange}/>
                <Button onClick={() => handleTableModify(modifiedTable)} variant={"contained"} sx={{width: "200px"}}>
                    Modifier
                </Button>
            </Stack>}
        </Dialog>
    );
}