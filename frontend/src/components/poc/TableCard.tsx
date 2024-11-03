import {Card, CardActionArea, CardContent, CardHeader, Divider, Stack, Typography} from "@mui/material";
import {blue, green, grey, red, yellow} from "@mui/material/colors";
import { TableStatusEnum} from "../../interfaces/Table.ts";

interface Table {
    tableNumber: number;
    customerNames: string[];
    totalPrices: number[];
  }

interface TableProps {
    table: Table;
    onClick: (tableNumber: number) => void;
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
        <Card sx={{backgroundColor: "orange", color: "black"}}>
            <CardActionArea onClick={() => onClick(table.tableNumber)}>
                <CardHeader title={`Table ${table.tableNumber}`} titleTypographyProps={{variant: "h4", align: "center"}}/>
                <Divider color={"black"} sx={{backgroundColor: "black"}}/>
                <CardContent component={Stack} spacing={1}>
                    <Typography fontSize={"large"}>Clients : {table.customerNames.join(", ")}</Typography>
                    <Typography fontSize={"large"}>Total : {table.totalPrices.reduce((acc, price) => acc + price, 0)} €</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}