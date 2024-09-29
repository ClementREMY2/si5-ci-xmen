import {Button, Dialog, Divider, Stack, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";
import {useState} from "react";
import {generatePath, useNavigate} from "react-router-dom";
import {Table, TableStatusEnum} from "../../interfaces/Table.ts";
import {privateRoutes} from "../../utils/Routes.ts";
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
    const navigate = useNavigate();

    const [modifiedTable, setModifiedTable] = useState<Table>(table);

    const handleChange = (key: keyof Table, value: string | number | undefined) => {
        setModifiedTable({...modifiedTable, [key]: value});
    };

    const onOrder = () => {
        navigate(generatePath(privateRoutes.orderTable, {table: table.table}));
    };

    const onPayment = () => {
        navigate(generatePath(privateRoutes.payment, {table: table.table}));
    };

    const displayActions = (
        table.status !== TableStatusEnum.AVAILABLE && table.status !== TableStatusEnum.RESERVED && (<>
            <Divider flexItem color={grey[200]} sx={{backgroundColor: grey[200]}}/>
            <Button onClick={onOrder} variant={"contained"} sx={{width: "220px"}}>
                Commander
            </Button>
            <Button onClick={onPayment} variant={"contained"} sx={{width: "220px"}}>
                Payer {table.event && ` pour ${table.event}`}
            </Button>
        </>)
    );

    return (
        <Dialog open={open} onClose={onClose}>
            <Stack spacing={3} margin={3} alignItems={"center"}>
                <Stack spacing={2} alignItems={"center"}>
                    <Typography variant={"h4"}>{`Modifier la table ${table.table}`}</Typography>
                    <ModifyTableMainContent table={modifiedTable} handleChange={handleChange}/>
                    <Button onClick={() => handleTableModify(modifiedTable)} variant={"contained"}
                            sx={{width: "220px"}}>
                        Modifier
                    </Button>
                </Stack>
                {displayActions}
            </Stack>
        </Dialog>
    );
}