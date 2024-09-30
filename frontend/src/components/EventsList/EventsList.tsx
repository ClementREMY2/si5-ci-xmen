import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@mui/material";
import {generatePath, useNavigate} from "react-router-dom";
import {privateRoutes} from "../../utils/Routes.ts";
import {Event} from "../../interfaces/Event.ts";

// interface EventItem {
//     id: number;
//     title: string;
//     details: string[];
// }

interface EventsListProps {
    todayEvents: Event[];
    nextDaysEvents: Event[];
}

export default function EventsList({todayEvents, nextDaysEvents}: Readonly<EventsListProps>) {
    const navigate = useNavigate();
    console.log(todayEvents);

    const handleSeeDetails = (eventId: string | undefined) => {
        console.log(eventId);
        navigate(generatePath(privateRoutes.event, {id: eventId}));
    };

    return (
        <Box>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>Évenements du jour</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List>
                        {todayEvents.map(event => (
                            <ListItem key={event.id}>
                                <ListItemText primary={event.name} secondary={`${event.menus.length}, ${event.date}`}/>
                                <Button onClick={() => handleSeeDetails(event.id)}>Voir Détails</Button>
                            </ListItem>
                        ))}
                    </List>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>Évenements des prochains jours</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List>
                        {nextDaysEvents.map(event => (
                            <ListItem key={event.id}>
                                <ListItemText primary={event.name} secondary={`${event.menus.length}, ${event.date}`}/>
                                <Button onClick={() => handleSeeDetails(event.id)}>Voir Détails</Button>
                            </ListItem>
                        ))}
                    </List>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}