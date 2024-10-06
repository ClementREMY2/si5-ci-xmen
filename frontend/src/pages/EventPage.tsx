import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {Box, Button, Checkbox, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import BackNavPageGeneric from "../components/generics/BackNavPageGeneric.tsx";
import MenuCard from "../components/MenuCard/MenuCard";
import {privateRoutes} from "../utils/Routes.ts";
import {MenuEvent, MenuItem} from "../interfaces/Menu.ts";
import { getEvent } from "../services/EventService.ts";
import {Event} from "../interfaces/Event.ts";

export default function EventsPage() {
    const navigate = useNavigate();
    const {id: eventId} = useParams();

    useEffect(() => {
        if (eventId === undefined || isNaN(parseFloat(eventId))) {
            console.warn("No event specified, redirecting to events page");
            navigate(privateRoutes.events);
        }
    }, [navigate, eventId]);

    const [isEdited, setIsEdited] = useState(false);
    const [isANewMenu, setIsANewMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    

    const ev: Event = {
        name: "Event",
        date: new Date(),
        menus: [],
        beverages: []
    }


    const menus: MenuEvent[] = [];
    const beverages: MenuItem[] = [];

    const [event, setEvent] = useState(ev);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                if (eventId) {
                    const event = await getEvent(eventId);
                    console.log("Event fetched:", event);
                    setEvent(event);
                }
                setEvent(event);
            } catch (error) {
                console.error("Error fetching event:", error);
            }
        };
        fetchEvent();
    }, [eventId]);



    const handleMenuUpdate = (e: any) => {
        console.log(e);
        setIsEdited(true);
        setIsANewMenu(false);
        setIsEditing(false);
    };

    const handleSaveModifications = () => {
        console.log("Sauvegarde des modifications");
        setIsEdited(false);
        setIsEditing(false);
    };

    const handleCancelModifications = () => {
        console.log("Annulation des modifications");
        setIsEdited(false);
        setIsEditing(false);
    };

    const handleAddMenu = () => {
        console.log("Ajout d'un menu");
        setIsANewMenu(true);
        setIsEditing(true);
    };


    const handleIsOnEdition = (e: boolean) => {
        setIsEditing(e);
        console.log(e);
    };

    const card = (
        <>
            <Typography variant="h3" sx={{marginRight: 1}}>{event.name}</Typography>
            <Box display="flex" justifyContent="flex-start" alignItems="center" sx={{marginLeft: 2}} gap={2} mt={2}>
                <Typography>Date de l'événement</Typography>
                <input type="date"/>
            </Box>
            <Box display="flex" justifyContent="flex-start" alignItems="center" sx={{marginLeft: 2}} gap={2} mt={2}>
                <Typography>Grouper commandes</Typography>
                <Checkbox></Checkbox>
            </Box>
            <Box display="flex" justifyContent="flex-start" sx={{margin: 2}} gap={2} mt={2}>
                <Button variant="contained" color="primary" disabled={isEditing} endIcon={<AddCircleOutlineIcon/>}
                        onClick={handleAddMenu}>
                    Ajouter un menu
                </Button>
            </Box>
            {menus.map((menu, index) => (
                <MenuCard
                    key={index}
                    menu={menu}
                    onMenuUpdate={(menuUpdated) => handleMenuUpdate(menuUpdated)}
                    editing={false}
                    allowEdit={!isEditing}
                    isOnEdition={(e) => handleIsOnEdition(e)}
                />
            ))}
            {isANewMenu && (
                <MenuCard
                    menu={{
                        fullName: "",
                        shortName: "",
                        price: 0,
                        menu: {},
                        id: "0"
                    }}
                    onMenuUpdate={(menuUpdated) => handleMenuUpdate(menuUpdated)}
                    editing={true}
                    allowEdit={!isEditing}
                    isOnEdition={(e) => setIsEditing(e)}
                />
            )}
            <Box display="flex" justifyContent="center" gap={2} mt={2}>
                <Button disabled={!isEdited} onClick={handleCancelModifications} variant="contained" color="error">
                    Annuler les modifications
                </Button>
                <Button disabled={!isEdited} onClick={handleSaveModifications} variant="contained" color="success">
                    Sauvegarder les modifications
                </Button>
            </Box>
        </>
    );

    return <BackNavPageGeneric title={"Evénement"} readyTables={1} children={card}/>;
}