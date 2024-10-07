import {Box, Button, Stack, Typography} from "@mui/material";
import "../index.css";
import {useEffect, useState} from "react";
import TableFilters from "../components/home/TableFilters.tsx";
import TableGrid from "../components/home/TableGrid.tsx";
import MainHeader from "../components/MainHeader.tsx";
import {DictionaryBoolean} from "../interfaces/Generics.ts";
import {Table, TableStatusEnum} from "../interfaces/Table.ts";
import {eventsMock} from "../mocks/Event.ts";
import { getTables } from "../formatter/TableFormatter.ts";
import { addMenu, getMenus } from "../formatter/MenuFormatter.ts";
import { MenuBackendNoId, GenericMenuItem } from "../interfaces/Menu.ts";
import { savePayment } from "../services/OrderService.ts";
import { usePopup } from "../components/PopupContext"; // Importer le contexte
import axios from "axios";
import { getEvents } from "../services/EventService.ts";


const events: DictionaryBoolean = eventsMock
    .map((event) => event.name)
    .reduce<{[key: string]: boolean}>((acc, eventName) => {
        acc[eventName] = true;
        return acc;
    }, {});

export default function HomePage() {
    const [selectedEvents, setSelectedEvents] = useState<DictionaryBoolean>({"Aucun": true});
    const [allTables, setAllTables] = useState<Table[]>([]);
    const [filteredTables, setFilteredTables] = useState<Table[]>([]);
    const [menus, setMenus] = useState<GenericMenuItem[]>([]);
    const { message, showPopup, hidePopup } = usePopup();

    const closePopup = async () => {
        hidePopup();
        // Perform setTable operation here
        setAllTables(await getTables());
    };    

    // Loading asynchronously the tables
    useEffect(() => {
        const fetchTables = async () => {
            const fetchedTables = await getTables();
            setAllTables(fetchedTables);
        };

        const fetchEvents = async () => {
            const fetchEvents = await getEvents();
            setSelectedEvents(fetchEvents.reduce<{[key: string]: boolean}>((acc, event) => {
                acc[event.name] = true;
                return acc;
            }, {"Aucun": true}));
        }

        fetchTables();
        fetchEvents();
    }, []);

    // Loading asynchronously the menus
    useEffect(() => {
        const fetchMenus = async () => {
            const fetchMenus = await getMenus();
            setMenus(fetchMenus);
        };

        fetchMenus();
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
            axios.post("http://localhost:3003/tables", modifiedTable);

            // TODO: update the table in the backend
            // I use menus.length as an id because I don't have any other way to have a fixed increasing number
            const newMenu: MenuBackendNoId = {
                fullName: "_|" + modifiedTable.table + "|" + modifiedTable.nbPeople + "|" + modifiedTable.event + "|" + modifiedTable.status,
                shortName: menus.length + "|" + modifiedTable.table + "|" + modifiedTable.nbPeople + "|" + modifiedTable.event + "|" + modifiedTable.status,
                price: 1,
                category: "DESSERT",
                image: "https://cdn.pixabay.com/photo/2016/11/12/15/28/restaurant-1819024_960_720.jpg"
            }
        
            if(modifiedTable.status === TableStatusEnum.OCCUPIED) {
                // send a payment with emtpy items not ended 
                savePayment({table: modifiedTable.table, date: new Date(), ended: false, items: {}, itemsEvent: {}});
            }
            addMenu(newMenu);
        }
    };

    return (
        <Stack height={"100%"} alignItems={"center"} paddingX={2} paddingTop={4} paddingBottom={2} spacing={3}
            overflow={"unset"}>
            <Box>
                {/* Votre contenu de la page d'accueil */}
                {showPopup && (
                    <Box
                        position="fixed"
                        top="50%"
                        left="50%"
                        sx={{ transform: "translate(-50%, -50%)" }} // Centrer le popup
                        bgcolor="black"
                        border="2px solid orange"
                        boxShadow={3}
                        p={2}
                        borderRadius={2}
                        zIndex={1000}
                    >
                        <Typography>{message}</Typography>
                        <Button onClick={closePopup}>Fermer</Button>
                    </Box>
                )}

            </Box>
            <MainHeader width={"90%"}/>
            <TableFilters selectedEvents={selectedEvents} setSelectedEvents={setSelectedEvents} width={"90%"}/>
            <TableGrid tables={filteredTables} handleTableModify={handleTableModify} width={"90%"}/>

        </Stack>
        
    );
}

function hidePopup() {
    throw new Error("Function not implemented.");
}
