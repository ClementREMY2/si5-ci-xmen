import {Stack} from "@mui/material";
import "../index.css";
import {useMemo, useState} from "react";
import TableFilters from "../components/home/TableFilters.tsx";
import TableGrid from "../components/home/TableGrid.tsx";
import MainHeader from "../components/MainHeader.tsx";
import {DictionaryBoolean} from "../interfaces/Generics.ts";
import {Table} from "../interfaces/Table.ts";
import {eventsMock} from "../mocks/Event.ts";
import {tablesMock} from "../mocks/Tables.ts";

const events: DictionaryBoolean = eventsMock
    .map((event) => event.name)
    .reduce<{[key: string]: boolean}>((acc, eventName) => {
        acc[eventName] = false;
        return acc;
    }, {});

export default function HomePage() {
    const [selectedEvents, setSelectedEvents] = useState<DictionaryBoolean>({...events, "Aucun": true});
    const [tables, setTables] = useState<Table[]>(tablesMock);

    useMemo(() => {
        const filteredTables = tablesMock.filter(table => selectedEvents[table.event ?? "Aucun"]);
        setTables(filteredTables);
    }, [selectedEvents]);

    const handleTableChange = (changedTable: Table) => {
        const newTables = [...tables];
        const index = newTables.findIndex((table) => table.id === changedTable.id);
        if (index !== -1) {
            newTables[index] = {...changedTable};
            setTables(newTables);
        }
    };

    return (
        <Stack height={"100%"} alignItems={"center"} paddingX={2} paddingTop={4} paddingBottom={2} spacing={3}
               overflow={"unset"}>
            <MainHeader width={"90%"}/>
            <TableFilters selectedEvents={selectedEvents} setSelectedEvents={setSelectedEvents} width={"90%"}/>
            <TableGrid tables={tables} handleTableChange={handleTableChange} width={"90%"}/>
        </Stack>
    );
}