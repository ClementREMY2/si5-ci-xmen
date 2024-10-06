import {Box, Button} from "@mui/material";
import React, {useState} from "react";
import {generatePath, useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import EventMainContent from "../components/event/EventMainContent.tsx";
import ActionCardGeneric from "../components/generics/ActionCardGeneric.tsx";
import BackNavPageGeneric from "../components/generics/BackNavPageGeneric.tsx";
import {Event} from "../interfaces/Event.ts";
import {TableStatusEnum} from "../interfaces/Table.ts";
import {emptyEvent, eventsMock} from "../mocks/Event.ts";
import {tablesMock} from "../mocks/Tables.ts";
import {privateRoutes} from "../utils/Routes.ts";

const getNbReadyTables = () => tablesMock.filter(table => table.status === TableStatusEnum.ORDER_READY).length;

const getEventByName = (eventName?: string) => eventsMock.find(event => event.name === eventName) ?? emptyEvent;

export default function EventPage() {
    const navigate = useNavigate();
    const {event: eventName} = useParams();

    const [event, setEvent] = useState<Event>(getEventByName(eventName));
    const [editEvent, setEditEvent] = useState<Event>(event);
    const [edit, setEdit] = useState<boolean>(!event.name);
    const [isMenuEditing, setIsMenuEditing] = useState<boolean>(false);

    const deleteClick = () => {
        if (!edit || !event.name) {
            toast.success("Événement supprimé");
            navigate(privateRoutes.events);
        } else { // Cancel edit mode
            setEditEvent(event);
            setEdit(false);
        }
    };

    const editClick = () => {
        if (!edit) setEdit(true);
        else { // Save / Create event
            setEvent(editEvent);
            setEdit(false);
            navigate(generatePath(privateRoutes.event, {event: event.name}));
            toast.success("Événement sauvegardé");
        }
    };

    const changeIsMenuEditing = (value: boolean) => setIsMenuEditing(value);

    const card: React.ReactNode = (
        <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} height={"100%"}>
            <ActionCardGeneric
                title={event.name ? event.name : "Nouvel événement"}
                mainContent={<EventMainContent event={editEvent} edit={edit} setEvent={setEditEvent}
                                               changeIsMenuEditing={changeIsMenuEditing}/>}
                buttons={<>
                    <Button onClick={deleteClick} variant={"contained"} color={edit ? "inherit" : "error"}
                            sx={{width: "200px"}}>
                        {edit ? "Annuler" : "Supprimer"}
                    </Button>
                    <Button onClick={editClick} variant={"contained"} sx={{width: "200px"}} disabled={isMenuEditing}>
                        {edit ? "Sauvegarder" : "Modifier"}
                    </Button>
                </>}
                minWidth={"95%"}
                minHeight={"95%"}
            />
        </Box>
    );

    return <BackNavPageGeneric title={"Événement"} readyTables={getNbReadyTables()} children={card}/>;
}