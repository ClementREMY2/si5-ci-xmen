import {EventBusy, InsertInvitation, Today} from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {Button, List, Stack} from "@mui/material";
import {EventCategoryEnum, Events} from "../../interfaces/Event.ts";
import EventListItem from "./EventListItem.tsx";

interface EventListProps {
    events: Events;
    width?: string | number;
    createNewEvent: () => void;
}

const eventList = [
    {key: "1", category: EventCategoryEnum.TODAY, icon: <Today color={"primary"}/>},
    {key: "2", category: EventCategoryEnum.FUTURE, icon: <InsertInvitation color={"primary"}/>},
    {key: "3", category: EventCategoryEnum.PAST, icon: <EventBusy color={"primary"}/>}
];

export default function EventList({events, width, createNewEvent}: Readonly<EventListProps>) {
    return (
        <Stack height={"100%"} overflow={"unset"} sx={{width}}>
            <Stack direction={"row"} justifyContent={"end"} alignItems={"center"}>
                <Button variant={"contained"} color={"primary"} onClick={createNewEvent}
                        endIcon={<AddCircleOutlineIcon/>}>
                    Ajouter un événement
                </Button>
            </Stack>
            <List sx={{height: "100%", overflowY: "auto"}}>
                {eventList.map(({key, category, icon}) => (
                    events[category].length > 0 &&
                    <EventListItem
                        key={key}
                        title={category.toUpperCase()}
                        icon={icon}
                        eventItems={events[category]}
                    />
                ))}
            </List>
        </Stack>
    );
}