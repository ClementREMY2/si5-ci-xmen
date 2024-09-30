import {Collapse, Divider, List} from "@mui/material";
import {Event} from "../../interfaces/Event.ts";
import EventSubListItem from "./EventSubListItem.tsx";

interface EventSubListProps {
    eventItems: Event[];
    open: boolean;
}

export default function EventSubList({eventItems, open}: Readonly<EventSubListProps>) {
    return (
        <Collapse in={open} timeout={"auto"} unmountOnExit>
            <List>
                <Divider/>
                {eventItems.map(event => (
                    <EventSubListItem key={event.id} event={event}/>
                ))}
            </List>
        </Collapse>
    );
}