import {Card, CardActionArea, CardContent, CardHeader, Divider, Grid2, Stack, Typography} from "@mui/material";
import {blue, green, grey, red, yellow} from "@mui/material/colors";
import {Table, TableStatusEnum} from "../../interfaces/Table.ts";

interface TableGridProps {
    tables: Table[];
    width?: string | number;
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

export default function TableGrid({tables, width}: Readonly<TableGridProps>) {
    return (
        <Grid2 container spacing={3} overflow={"auto"} sx={{width}}>
            {tables.map(table => (
                <Grid2 key={table.id} size={4}>
                    <Card
                        sx={{backgroundColor: tableColor(table.status), color: "black"}}>
                        <CardActionArea onClick={() => console.log(table)}>
                            <CardHeader title={`Table ${table.table}`}
                                        titleTypographyProps={{variant: "h4", align: "center"}}/>
                            <Divider color={"black"} sx={{backgroundColor: "black"}}/>
                            <CardContent component={Stack} spacing={1}>
                                <Typography fontSize={"large"}>Nombre : {table.nbPeople}</Typography>
                                <Typography fontSize={"large"}>État : {table.status}</Typography>
                                <Typography fontSize={"large"}>Événement : {table.event ?? "Aucun"}</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid2>
            ))}
        </Grid2>
    );
}