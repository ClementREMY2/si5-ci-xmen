import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface EventItem {
  id: number;
  title: string;
  details: string[];
}

interface EventsListProps {
    todayEvents: EventItem[];
    nextDaysEvents: EventItem[];
}


const handleSeeDetails = (event: EventItem) => {
    console.log(event);
    window.location.href = `/event/${event.id}`;
}





const EventsList: React.FC<EventsListProps> = ({ todayEvents, nextDaysEvents }) => {
  return (
    <Box>
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Évenements du jour</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <List>
                    {todayEvents.map(event => (
                        <ListItem key={event.id}>
                            <ListItemText primary={event.title} secondary={event.details.join(', ')} />
                            <Button onClick={() =>handleSeeDetails}>Voir Détails</Button>
                        </ListItem>
                    ))}
                </List>
            </AccordionDetails>
        </Accordion>
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Évenements des prochains jours</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <List>
                    {nextDaysEvents.map(event => (
                        <ListItem key={event.id}>
                            <ListItemText primary={event.title} secondary={event.details.join(', ')} />
                            <Button onClick={() => handleSeeDetails}>Voir Détails</Button>
                        </ListItem>
                    ))}

                </List>
            </AccordionDetails>
        </Accordion>
    </Box>
  );
};

export default EventsList;