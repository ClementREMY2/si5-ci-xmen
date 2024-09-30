import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {Box, Button, Typography} from "@mui/material";
import EventsList from "../components/EventsList/EventsList";
import { SetStateAction, useEffect, useState } from "react";
import axios from "axios";



export default function EventsPage() {

    const [sampleEvents, setSampleEvents] = useState([]);
    let ev = {
        todayEvents: [],
        nextDaysEvents: []
    };

    useEffect(() => {
        axios.get("http://localhost:3003/events")
            .then((response: { data: SetStateAction<never[]>; }) => {
                console.log(response.data);
                setSampleEvents(response.data);
                ev = {
                    todayEvents: [sampleEvents[1]],
                    nextDaysEvents: []
                };

            })
            .catch((error: any) => {
                console.error("There was an error fetching the events!", error);
            });
    }, []);


    return (<>
        <Box display="flex" justifyContent="center" sx={{margin: 2}}>
            <Typography variant="h4">Événements</Typography>
        </Box>
        <Box display="flex" justifyContent="flex-start" sx={{margin: 2}} gap={2} mt={2}>
            <Button variant="contained" color="primary" endIcon={<AddCircleOutlineIcon/>}>
                Ajouter un évenement
            </Button>
        </Box>
        {sampleEvents[1] && <EventsList todayEvents={[sampleEvents[1]]} nextDaysEvents={ev.nextDaysEvents}/>}
    </>);
}