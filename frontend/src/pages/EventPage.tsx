import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {Box, Button, Checkbox, IconButton, TextField, Typography} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check'; 
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import BackNavPageGeneric from "../components/generics/BackNavPageGeneric.tsx";
import MenuCard from "../components/MenuCard/MenuCard";
import {privateRoutes} from "../utils/Routes.ts";
import {MenuEvent, MenuCategoryEnum} from "../interfaces/Menu.ts";
import { getEvent, saveEvent } from "../services/EventService.ts";
import {Event} from "../interfaces/Event.ts";
import { v4 as uuidv4 } from 'uuid';

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
    const [isBeverageEditing, setIsBeverageEditing] = useState(false);
    const [beverageName, setBeverageName] = useState("");
    const [beveragePrice, setBeveragePrice] = useState(0);

    const [event, setEvent] = useState<Event>();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                if (eventId) {
                    const e = await getEvent(eventId);
                    setEvent(e);
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            }
        };
        fetchEvent();
    }, [eventId]);


    const handleMenuUpdate = (e: MenuEvent) => {
        
        const ev = event;
        if (ev) {
            const index = ev.menus.findIndex((menu) => menu.id === e.id);
            if (index !== -1) {
                ev.menus[index] = e;
                setEvent(ev);
            } else {
                ev.menus.push(e);
                
                setEvent(ev);
            }
        }
        setIsEdited(true);
        setIsANewMenu(false);
        setIsEditing(false);
    };

    const handleSaveModifications = () => {
        
        if (event)
            saveEvent(event);
        setIsEdited(false);
        setIsEditing(false);
    };

    const handleCancelModifications = () => {
        
        setIsEdited(false);
        setIsEditing(false);
    };

    const handleAddMenu = () => {
        
        setIsANewMenu(true);
        setIsEditing(true);
    };


    const handleIsOnEdition = (e: boolean) => {
        setIsEditing(e);
        
    };

    const handleTitleChange = (e: string) => {
        setEvent({
            ...event,
            name: e,
            date: event?.date || new Date(), 
            menus: event?.menus || [],
            beverages: event?.beverages || []
        } as Event)
        if (e !== "")
            setIsEdited(true);
        else
            setIsEdited(false);
    }

    const handleAddBeverage = () => {
        setIsBeverageEditing(true);
    }
    

    const handleSaveBeverage = () => {
        const e = event;
        if (e) {
            e.beverages.push({fullName: beverageName, shortName: beverageName, price: beveragePrice, category: MenuCategoryEnum.BEVERAGE, id: uuidv4()});
            setEvent(e);
        }
        setIsBeverageEditing(false);
        setIsEdited(true);
    }
    const card = (
        <>
            {eventId!=="0" && <Typography variant="h3" sx={{marginRight: 1}}>{event && event.name}</Typography>}
            {eventId === "0" && (
                <TextField
                    placeholder="Nom de l'événement"
                    variant="outlined"
                    size="medium"
                    onChange={(e) =>
                        handleTitleChange(e.target.value)
                    }
                />
            )}
            <Box display="flex" justifyContent="flex-start" alignItems="center" sx={{marginLeft: 2}} gap={2} mt={2}>
                <Typography>Date de l'événement</Typography>
                <input
                    type="date"
                    value={event ? new Date(event.date).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                        const date = new Date(e.target.value);
                        setEvent({
                            ...event,
                            date: date,
                            name: event?.name || "",
                            menus: event?.menus || [],
                            beverages: event?.beverages || []
                        } as Event);
                        setIsEdited(true);
                    }}
                />
            </Box>
            <Box display="flex" justifyContent="flex-start" alignItems="center" sx={{marginLeft: 2}} gap={2} mt={2}>
                <Typography>Boissons</Typography>
                <IconButton onClick={handleAddBeverage}>
                    <AddCircleOutlineIcon/>
                </IconButton>
                <Box display="flex" justifyContent="flex-start" alignItems="center" sx={{marginLeft: 2}} gap={2} mt={2}>
                    {event?.beverages.map((beverage, index) => (
                        <Typography key={index}>{beverage.fullName} - {beverage.price}€</Typography>
                    ))}
                </Box>
            {isBeverageEditing && (
                <Box display="flex" justifyContent="flex-start" alignItems="center" sx={{marginLeft: 2}} gap={2} mt={2}>
                    <TextField
                        placeholder="Nom de la boisson"
                        variant="outlined"
                        size="medium"
                        onChange={(e) => setBeverageName(e.target.value)}
                    />
                    <TextField
                        placeholder="Prix de la boisson"
                        variant="outlined"
                        size="medium"
                        type="number"
                        onChange={(e) => setBeveragePrice(parseFloat(e.target.value))}
                    />
                    <IconButton onClick={handleSaveBeverage}>
                        <CheckIcon />
                    </IconButton>
                </Box>
                )}
            </Box>
            <Box display="flex" justifyContent="flex-start" sx={{margin: 2}} gap={2} mt={2}>
                <Button variant="contained" color="primary" disabled={isEditing} endIcon={<AddCircleOutlineIcon/>}
                        onClick={handleAddMenu}>
                    Ajouter un menu
                </Button>
            </Box>
            {event && event.menus.map((menu, index) => (
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
                        menu: {
                            Entree: {id: "0" ,category: MenuCategoryEnum.STARTER, fullName: "", shortName:"", price: 0},
                        
                            Plat: {id: "0",category: MenuCategoryEnum.MAIN, fullName: "", shortName:"", price: 0},
                            Dessert: {id: "0",category: MenuCategoryEnum.DESSERT, fullName: "", shortName:"", price: 0},
                        },
                        id: uuidv4()
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