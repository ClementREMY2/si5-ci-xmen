import { Stack } from "@mui/material";
import "../index.css";
import { useEffect, useState } from "react";
import TableFilters from "../components/home/TableFilters.tsx";
import TableGrid from "../components/home/TableGrid.tsx";
import MainHeader from "../components/MainHeader.tsx";
import { DictionaryBoolean } from "../interfaces/Generics.ts";
import { Table } from "../interfaces/Table.ts";
import { eventsMock } from "../mocks/Event.ts";
import useFetchTables, { applyTableColors, updateTable } from "../formatter/TableFormatter.ts";  

const events: DictionaryBoolean = eventsMock
    .map((event) => event.name)
    .reduce<{ [key: string]: boolean }>((acc, eventName) => {
        acc[eventName] = true;
        return acc;
    }, {});

export default function HomePage() {
    const [filteredTables, setFilteredTables] = useState<Table[]>(() => {
        const storedTables = localStorage.getItem("tables");
        return storedTables ? JSON.parse(storedTables) : [];
    });

    const { tables: fetchedTables, loading, error } = useFetchTables();
    const [selectedEvents, setSelectedEvents] = useState<DictionaryBoolean>({ ...events, "Aucun": true });

    useEffect(() => {
        if (fetchedTables && fetchedTables.length > 0 && filteredTables.length === 0) {
            fetchedTables.forEach(applyTableColors);
            setFilteredTables(fetchedTables);
            localStorage.setItem("tables", JSON.stringify(fetchedTables));
        }
    }, [fetchedTables, filteredTables.length]);
    useEffect(() => {
        const newFilteredTables = filteredTables.filter(table => 
            selectedEvents[table.event ?? "Aucun"] || table.event === ''
        );
        setFilteredTables(newFilteredTables);
    }, [selectedEvents]);

    const handleTableModify = (modifiedTable: Table) => {
        const newTables = [...filteredTables];
        const index = newTables.findIndex((table) => table.id === modifiedTable.id);

        if (index !== -1) {
            updateTable(modifiedTable);
            newTables[index] = { ...modifiedTable };
            setFilteredTables(newTables);
            localStorage.setItem("tables", JSON.stringify(newTables));
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Stack height={"100%"} alignItems={"center"} paddingX={2} paddingTop={4} paddingBottom={2} spacing={3} overflow={"unset"}>
            <MainHeader width={"90%"} />
            <TableFilters selectedEvents={selectedEvents} setSelectedEvents={setSelectedEvents} width={"90%"} />
            <TableGrid tables={filteredTables} handleTableModify={handleTableModify} width={"90%"} />
        </Stack>
    );
}
