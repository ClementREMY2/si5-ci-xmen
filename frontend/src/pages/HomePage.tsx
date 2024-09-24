import {Stack} from "@mui/material";
import "../index.css";
import {useState} from "react";
import TableFilters from "../components/home/TableFilters.tsx";
import MainHeader from "../components/MainHeader.tsx";
import {DictionaryBoolean} from "../interfaces/Generics.ts";
import {eventsMock} from "../mocks/Event.ts";

const events: DictionaryBoolean = eventsMock
    .map((event) => event.name)
    .reduce<{[key: string]: boolean}>((acc, eventName) => {
        acc[eventName] = false;
        return acc;
    }, {});

export default function HomePage() {
    const [selectedEvents, setSelectedEvents] = useState(events);

    return (
        <Stack height={"100%"} alignItems={"center"} padding={2} paddingTop={4} spacing={3} overflow={"unset"}>
            <MainHeader width={"90%"}/>
            <TableFilters selectedEvents={selectedEvents} setSelectedEvents={setSelectedEvents}/>
        </Stack>
    );
}