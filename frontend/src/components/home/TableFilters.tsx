import {Button, Chip, Stack} from "@mui/material";
import React from "react";
import {DictionaryBoolean} from "../../interfaces/Generics.ts";

interface TableFiltersProps {
    selectedEvents: DictionaryBoolean;
    setSelectedEvents: React.Dispatch<React.SetStateAction<DictionaryBoolean>>;
    width?: string | number;
}

export default function TableFilters({selectedEvents, setSelectedEvents, width}: Readonly<TableFiltersProps>) {
    const handleAllClick = (value: boolean) => {
        const selectedEventsCopy = {...selectedEvents};
        for (const [key] of Object.entries(selectedEvents)) {
            selectedEventsCopy[key] = value;
        }
        selectedEventsCopy["Aucun"] = true; // Ensure "Aucun" is always selected
        setSelectedEvents(selectedEventsCopy);
    };

    const handleEventClick = (eventName: string) => {
        setSelectedEvents((prevState) => ({...prevState, [eventName]: !prevState[eventName]}));
    };

    return (
        <Stack direction={"row"} alignItems={"center"} spacing={2} sx={{width}}>
            <Button variant={"contained"} onClick={() => handleAllClick(true)}>Activer tous</Button>
            {Object.entries(selectedEvents).map(([eventName, selected]) => (
                <Chip key={eventName} label={eventName} variant={selected ? "filled" : "outlined"} color={"primary"}
                      onClick={() => handleEventClick(eventName)}/>
            ))}
            <Button variant={"contained"} onClick={() => handleAllClick(false)}>Activer aucun</Button>
        </Stack>
    );
}