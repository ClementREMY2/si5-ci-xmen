import {Stack} from "@mui/material";
import "../index.css";
import {useEffect, useMemo, useState} from "react";
import TableFilters from "../components/home/TableFilters.tsx";
import TableGrid from "../components/home/TableGrid.tsx";
import MainHeader from "../components/MainHeader.tsx";
import {DictionaryBoolean} from "../interfaces/Generics.ts";
import {Table, TableStatusEnum} from "../interfaces/Table.ts";
import {eventsMock} from "../mocks/Event.ts";
import { getTables } from "../formatter/TableFormatter.ts";
import { getMenusGateway } from "../services/MenuService.ts";
import { tablesMock } from "../mocks/Tables.ts";
import { addMenu } from "../formatter/MenuFormatter.ts";
import { MenuBackendNoId, MenuCategoryEnumBackend } from "../interfaces/Menu.ts";

const events: DictionaryBoolean = eventsMock
    .map((event) => event.name)
    .reduce<{[key: string]: boolean}>((acc, eventName) => {
        acc[eventName] = true;
        return acc;
    }, {});

export default function HomePage() {
    console.log(getMenusGateway())
    const [selectedEvents, setSelectedEvents] = useState<DictionaryBoolean>({...events, "Aucun": true});
    const [tables, setTables] = useState<Table[]>([]);

    // Charger les tables de manière asynchrone dans un useEffect
    useEffect(() => {
        const fetchTables = async () => {
            const fetchedTables = await getTables();
            setTables(fetchedTables);
        };

        fetchTables();
    }, []);

    useMemo(() => {
        const filteredTables = tables.filter(table => selectedEvents[table.event ?? "Aucun"]);
        setTables(filteredTables);
    }, [selectedEvents]);

    const correctModifiedTable = (previousTable: Table, modifiedTable: Table) => {
        if (!previousTable.event && modifiedTable.event && modifiedTable.status === TableStatusEnum.AVAILABLE) {
            modifiedTable.status = TableStatusEnum.RESERVED;
        }
        if (modifiedTable.status === TableStatusEnum.AVAILABLE) {
            modifiedTable.event = undefined;
        }
    };

    const handleTableModify = (modifiedTable: Table) => {
        const newTables = [...tables];
        const index = newTables.findIndex((table) => table.id === modifiedTable.id);
        if (index !== -1) {
            correctModifiedTable(newTables[index], modifiedTable);
            newTables[index] = {...modifiedTable};
            setTables(newTables);
            // TODO: update the table in the backend
            const newMenu: MenuBackendNoId = {
                fullName: modifiedTable.nbPeople + "|" + modifiedTable.event + "|" + modifiedTable.status,
                shortName: modifiedTable.nbPeople + "|" + modifiedTable.event + "|" + modifiedTable.status,
                price: 1,
                category: "DESSERT",
                image: "https://cdn.pixabay.com/photo/2016/11/12/15/28/restaurant-1819024_960_720.jpg"
            }
            console.log(newMenu);
            addMenu(newMenu);
        }
    };

    return (
        <Stack height={"100%"} alignItems={"center"} paddingX={2} paddingTop={4} paddingBottom={2} spacing={3}
               overflow={"unset"}>
            <MainHeader width={"90%"}/>
            <TableFilters selectedEvents={selectedEvents} setSelectedEvents={setSelectedEvents} width={"90%"}/>
            <TableGrid tables={tables} handleTableModify={handleTableModify} width={"90%"}/>
        </Stack>
    );
}