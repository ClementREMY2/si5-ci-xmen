import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import EventsList from "../components/EventsList/EventsList";
import { getAllEvents, getNextEvents, getTodayEvents } from "../formatter/EventFormatter";
import { getMenusBackend } from "../formatter/MenuFormatter";
import { Event, EventItem } from "../interfaces/Event";
import {getEvents} from "../services/EventService";
import {generatePath, useNavigate} from "react-router-dom";
import {privateRoutes} from "../utils/Routes.ts";

export default function EventsPage() {
    const [events, setEvents] = useState<Event[] | undefined>(undefined);
    const [todayEvents, setTodayEvents] = useState<EventItem[]>([]);
    const [nextDaysEvents, setNextDaysEvents] = useState<EventItem[]>([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const allEvents = await getEvents();
                setEvents(allEvents); 

                setTodayEvents(getTodayEvents(allEvents));
                setNextDaysEvents(getNextEvents(allEvents));
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, []);

    if (!events) {
        return <Typography>Chargement des événements...</Typography>;
    }


    const createNewEvent = () => {
        navigate(generatePath(privateRoutes.event, {id: "0"}));
    }

    return (
        <>
            <Box display="flex" justifyContent="center" sx={{ margin: 2 }}>
                <Typography variant="h4">Événements</Typography>
            </Box>
            <Box display="flex" justifyContent="flex-start" sx={{ margin: 2 }} gap={2} mt={2}>
                <Button variant="contained" color="primary" endIcon={<AddCircleOutlineIcon />} onClick={createNewEvent}>
                    Ajouter un évenement
                </Button>
            </Box>
            <EventsList todayEvents={todayEvents} nextDaysEvents={nextDaysEvents} />
        </>
    );
}
