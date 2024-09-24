import {Card, CardActionArea, CardContent, CardHeader, Divider, Grid2, Stack, Typography} from "@mui/material";
import "../index.css";
import {blue, green, grey, red, yellow} from "@mui/material/colors";
import {useState} from "react";
import TableFilters from "../components/home/TableFilters.tsx";
import MainHeader from "../components/MainHeader.tsx";
import {DictionaryBoolean} from "../interfaces/Generics.ts";
import {TableStatusEnum} from "../interfaces/Table.ts";
import {eventsMock} from "../mocks/Event.ts";
import {tablesMock} from "../mocks/Tables.ts";

const events: DictionaryBoolean = eventsMock
    .map((event) => event.name)
    .reduce<{[key: string]: boolean}>((acc, eventName) => {
        acc[eventName] = false;
        return acc;
    }, {});

export default function HomePage() {
    const [selectedEvents, setSelectedEvents] = useState<DictionaryBoolean>(events);

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

    return (
        <Stack height={"100%"} alignItems={"center"} paddingX={2} paddingTop={4} paddingBottom={2} spacing={3}
               overflow={"unset"}>
            <MainHeader width={"90%"}/>
            <TableFilters selectedEvents={selectedEvents} setSelectedEvents={setSelectedEvents}/>
            <Grid2 container spacing={3} width={"90%"} overflow={"auto"}>
                {tablesMock.map(table => (
                    <Grid2 key={table.id} size={4}>
                        <Card
                            sx={{backgroundColor: tableColor(table.status), color: "black", border: "1px solid black"}}>
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
        </Stack>
    );
}