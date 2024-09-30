import {ExpandLess, ExpandMore} from "@mui/icons-material";
import {ListItem, ListItemButton, ListItemIcon, ListItemText, Stack} from "@mui/material";
import React, {useMemo, useState} from "react";
import {Event} from "../../interfaces/Event.ts";
import EventSubList from "./EventSubList.tsx";

interface EventListItemProps {
    title: string;
    icon?: React.ReactElement;
    eventItems: Event[];
}

export default function EventListItem({title, icon, eventItems}: Readonly<EventListItemProps>) {
    const [open, setOpen] = useState<boolean>(true);

    const hasItems = useMemo(() => eventItems.length > 0, [eventItems]);

    return (
        <ListItem disableGutters><Stack width={"100%"}>
            <ListItemButton onClick={() => setOpen(!open)} disableGutters>
                {icon && <ListItemIcon>{icon}</ListItemIcon>}
                <ListItemText primary={title}/>
                {hasItems && (open ? <ExpandLess/> : <ExpandMore/>)}
            </ListItemButton>
            {hasItems &&
                <EventSubList eventItems={eventItems} open={open}/>}
        </Stack></ListItem>
    );
}