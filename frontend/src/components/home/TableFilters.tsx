import {Button, Chip, Stack} from "@mui/material";
import React, {useMemo} from "react";
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

    const singleEvent = useMemo(() => {
        if (selectedEvents["Aucun"]) return undefined;
        const events = Object.entries(selectedEvents).reduce((acc, [eventName, selected]) => {
            if (selected) acc.push(eventName);
            return acc;
        }, [] as string[]);
        if (events.length !== 1) return undefined; // Want just 1 event
        return events[0];
    }, [selectedEvents]);

    const handlePayAllClick = () => {
        console.log("Paying all tables for", singleEvent);
    };

    return (
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} spacing={3} sx={{width}}>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
                <Button variant={"contained"} onClick={() => handleAllClick(true)}>Activer tous</Button>
                {Object.entries(selectedEvents).map(([eventName, selected]) => (
                    <Chip key={eventName} label={eventName} variant={selected ? "filled" : "outlined"} color={"primary"}
                          onClick={() => handleEventClick(eventName)}/>
                ))}
                <Button variant={"contained"} onClick={() => handleAllClick(false)}>Activer aucun</Button>
            </Stack>
            {singleEvent &&
                <Button variant={"contained"} onClick={handlePayAllClick} sx={{width: 150}}>
                    Payer toutes
                </Button>}
        </Stack>
    );
}