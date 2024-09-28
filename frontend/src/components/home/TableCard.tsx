import {Card, CardActionArea, CardContent, CardHeader, Divider, Stack, Typography} from "@mui/material";
import {blue, green, grey, red, yellow} from "@mui/material/colors";
import {Table, TableStatusEnum} from "../../interfaces/Table.ts";

interface TableProps {
    table: Table;
    onClick: () => void;
}

const tableColor = (status: TableStatusEnum): string => {
    switch (status) {
        case TableStatusEnum.AVAILABLE:
            return grey[200];
        case TableStatusEnum.RESERVED:
            return yellow[200];
        case TableStatusEnum.OCCUPIED:
            return red[200];
        case TableStatusEnum.ORDER_READY:
            return green[200];
        case TableStatusEnum.ORDER_IN_PROGRESS:
            return blue[200];
    }
};

export default function TableCard({table, onClick}: Readonly<TableProps>) {
    return (
        <Card sx={{backgroundColor: tableColor(table.status), color: "black"}}>
            <CardActionArea onClick={onClick}>
                <CardHeader title={`Table ${table.table}`} titleTypographyProps={{variant: "h4", align: "center"}}/>
                <Divider color={"black"} sx={{backgroundColor: "black"}}/>
                <CardContent component={Stack} spacing={1}>
                    <Typography fontSize={"large"}>Nombre : {table.nbPeople}</Typography>
                    <Typography fontSize={"large"}>État : {table.status}</Typography>
                    <Typography fontSize={"large"}>Événement : {table.event ?? "Aucun"}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}