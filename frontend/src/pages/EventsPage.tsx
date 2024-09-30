import {Stack} from "@mui/material";
import EventList from "../components/events/EventList.tsx";
import MainHeader from "../components/MainHeader.tsx";
import {EventCategoryEnum, Events} from "../interfaces/Event.ts";
import {eventsMock} from "../mocks/Event.ts";

const extractedEvents: Events = eventsMock.reduce((acc, item) => {
    if (item.date.toDateString() === new Date().toDateString()) acc[EventCategoryEnum.TODAY].push(item);
    else if (item.date > new Date()) acc[EventCategoryEnum.FUTURE].push(item);
    else acc[EventCategoryEnum.PAST].push(item);
    return acc;
}, {
    [EventCategoryEnum.TODAY]: [],
    [EventCategoryEnum.FUTURE]: [],
    [EventCategoryEnum.PAST]: []
} as Events);

export default function EventsPage() {
    return (
        <Stack height={"100%"} alignItems={"center"} paddingX={2} paddingTop={4} paddingBottom={2} spacing={3}
               overflow={"unset"}>
            <MainHeader width={"90%"}/>
            <EventList events={extractedEvents} width={"90%"}/>
        </Stack>
    );
}