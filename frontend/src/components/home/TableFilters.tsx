import {Button, Chip, Stack} from "@mui/material";
import React from "react";
import {DictionaryBoolean} from "../../interfaces/Generics.ts";

interface TableFiltersProps {
    selectedEvents: DictionaryBoolean;
    setSelectedEvents: React.Dispatch<React.SetStateAction<DictionaryBoolean>>;
}

export default function TableFilters({selectedEvents}: Readonly<TableFiltersProps>) {
    return (
        <Stack direction={"row"} alignItems={"center"} width={"90%"} spacing={2}>
            <Button variant={"contained"}>Tous</Button>
            {Object.entries(selectedEvents).map(([eventName, selected]) => (
                <Chip key={eventName} label={eventName} variant={"outlined"} color={"primary"} disabled={selected}/>
            ))}
            <Button variant={"contained"}>Aucun</Button>
        </Stack>
    );
}