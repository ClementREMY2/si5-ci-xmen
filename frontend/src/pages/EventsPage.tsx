import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {Box, Button, Typography} from "@mui/material";
import EventsList from "../components/EventsList/EventsList";


export default function EventsPage() {
    const sampleEvents = [
        {
            id: 1,
            title: "Avisto",
            details: ["3 menus", "22/09/2024"]
        },
        {
            id: 2,
            title: "SAP",
            details: ["2 menus", "24/09/2024"]
        },
        {
            id: 3,
            title: "Air France",
            details: ["4 menus", "26/09/2024"]
        }
    ];

    const ev = {
        todayEvents: [sampleEvents[0]],
        nextDaysEvents: [sampleEvents[1], sampleEvents[2]]
    };

    return (<>
        <Box display="flex" justifyContent="center" sx={{margin: 2}}>
            <Typography variant="h4">Événements</Typography>
        </Box>
        <Box display="flex" justifyContent="flex-start" sx={{margin: 2}} gap={2} mt={2}>
            <Button variant="contained" color="primary" endIcon={<AddCircleOutlineIcon/>}>
                Ajouter un évenement
            </Button>
        </Box>
        <EventsList todayEvents={ev.todayEvents} nextDaysEvents={ev.nextDaysEvents}/>
    </>);
}