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
    console.log(getTables());
    console.log(getMenusGateway());
    const [selectedEvents, setSelectedEvents] = useState<DictionaryBoolean>({...events, "Aucun": true});
    const [allTables, setAllTables] = useState<Table[]>([]);
    const [filteredTables, setFilteredTables] = useState<Table[]>([]);


    // Loading asynchronously the tables
    useEffect(() => {
        const fetchTables = async () => {
            const fetchedTables = await getTables();
            setAllTables(fetchedTables);
        };

        fetchTables();
    }, []);

    useEffect(() => {
        const filtered = allTables.filter(table => selectedEvents[table.event ?? "Aucun"]);
        setFilteredTables(filtered);
    }, [selectedEvents, allTables]);

    const correctModifiedTable = (previousTable: Table, modifiedTable: Table) => {
        if (!previousTable.event && modifiedTable.event && modifiedTable.status === TableStatusEnum.AVAILABLE) {
            modifiedTable.status = TableStatusEnum.RESERVED;
        }
        if (modifiedTable.status === TableStatusEnum.AVAILABLE) {
            modifiedTable.event = undefined;
        }
        if (modifiedTable.event === undefined) {
            modifiedTable.event = "Aucun";
        }
    };

    const handleTableModify = (modifiedTable: Table) => {
        const newTables = [...allTables];
        const index = newTables.findIndex((table) => table.id === modifiedTable.id);
        if (index !== -1) {
            correctModifiedTable(newTables[index], modifiedTable);
            newTables[index] = {...modifiedTable};
            setAllTables(newTables);
            // TODO: update the table in the backend
            const newMenu: MenuBackendNoId = {
                fullName: modifiedTable.table + "|" + modifiedTable.nbPeople + "|" + modifiedTable.event + "|" + modifiedTable.status,
                shortName: modifiedTable.table + "|" + modifiedTable.nbPeople + "|" + modifiedTable.event + "|" + modifiedTable.status,
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
            <TableGrid tables={filteredTables} handleTableModify={handleTableModify} width={"90%"}/>
        </Stack>
    );
}