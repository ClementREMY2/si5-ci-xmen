import {Button, Chip, Stack} from "@mui/material";
import React from "react";
import {DictionaryBoolean} from "../../interfaces/Generics.ts";

interface TableFiltersProps {
    selectedEvents: DictionaryBoolean;
    setSelectedEvents: React.Dispatch<React.SetStateAction<DictionaryBoolean>>;
}

export default function TableFilters({selectedEvents, setSelectedEvents}: Readonly<TableFiltersProps>) {
    const handleAllClick = (value: boolean) => {
        const selectedEventsCopy = {...selectedEvents};
        for (const [key] of Object.entries(selectedEvents)) {
            selectedEventsCopy[key] = value;
        }
        setSelectedEvents(selectedEventsCopy);
    };

    const handleEventClick = (eventName: string) => {
        setSelectedEvents((prevState) => ({...prevState, [eventName]: !prevState[eventName]}));
    };

    return (
        <Stack direction={"row"} alignItems={"center"} width={"90%"} spacing={2}>
            <Button variant={"contained"} onClick={() => handleAllClick(true)}>Tous</Button>
            {Object.entries(selectedEvents).map(([eventName, selected]) => (
                <Chip key={eventName} label={eventName} variant={selected ? "filled" : "outlined"} color={"primary"}
                      onClick={() => handleEventClick(eventName)}/>
            ))}
            <Button variant={"contained"} onClick={() => handleAllClick(false)}>Aucun</Button>
        </Stack>
    );
}