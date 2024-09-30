import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {Box, Button, Checkbox, Typography} from "@mui/material";
import {SetStateAction, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import BackNavPageGeneric from "../components/generics/BackNavPageGeneric.tsx";
import MenuCard from "../components/MenuCard/MenuCard";
import {privateRoutes} from "../utils/Routes.ts";
import axios from "axios";
import {Event} from "../interfaces/Event.ts";
import { MenuCategoryEnum } from "../interfaces/Menu.ts";

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
const mockEvent: Event = {
    id: '1',
    name: '',
    date: new Date(0), // Date par défaut (epoch)
    menus: [
        {
            id: '',
            fullName: '',
            shortName: '',
            price: 0,
            menu: {
                [MenuCategoryEnum.STARTER]: {
                    id: '',
                    fullName: '',
                    shortName: '',
                    price: 0,
                    category: MenuCategoryEnum.STARTER
                },
                [MenuCategoryEnum.MAIN]: {
                    id: '',
                    fullName: '',
                    shortName: '',
                    price: 0,
                    category: MenuCategoryEnum.MAIN
                },
                [MenuCategoryEnum.DESSERT]: {
                    id: '',
                    fullName: '',
                    shortName: '',
                    price: 0,
                    category: MenuCategoryEnum.DESSERT
                },
                [MenuCategoryEnum.BEVERAGE]: {
                    id: '',
                    fullName: '',
                    shortName: '',
                    price: 0,
                    category: MenuCategoryEnum.BEVERAGE
                }
            }
        }
    ],
    beverages: [
        {
            id: '',
            fullName: '',
            shortName: '',
            price: 0,
            category: MenuCategoryEnum.BEVERAGE
        }
    ]
};

    const [sampleEvents, setSampleEvents] = useState([]);
    const [event, setEvent] = useState<Event>(mockEvent);

    useEffect(() => {
        axios.get("http://localhost:3003/events")
            .then((response: { data: Event[]; }) => {
                console.log(response.data[1]);
                setEvent(response.data[1]);
            })
            .catch((error: any) => {
                console.error("There was an error fetching the events!", error);
            });
    }, []);
    
    
    
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

    const card = (event && 
        <>
            <Typography variant="h3" sx={{marginRight: 1}}>{event?.name}</Typography>
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
            {event.menus.map((menu, index) => (
                <MenuCard
                    key={index}
                    // title={menu.shortName}
                    // entree={}
                    // mainCourse={menu.mainCourse}
                    // dessert={menu.dessert}
                    // drink1={menu.drink1}
                    // drink2={menu.drink2}
                    // price={menu.price}
                    // onMenuUpdate={(menuUpdated) => handleMenuUpdate(menuUpdated)}
                    // editing={false}
                    // allowEdit={!isEditing}
                    // isOnEdition={(e) => handleIsOnEdition(e)}
                    {...menu}
                    onMenuUpdate={(menuUpdated) => handleMenuUpdate(menuUpdated)}
                    editing={true}
                    allowEdit={!isEditing}
                    isOnEdition={(e) => setIsEditing(e)}
                />
            ))}
            {/* {isANewMenu && (
                // <MenuCard
                //     title={""}
                //     entree={{category: "Entrée", name: "", price: 0}}
                //     mainCourse={{category: "Plat", name: "", price: 0}}
                //     dessert={{category: "Dessert", name: "", price: 0}}
                //     drink1={{category: "Boisson 1", name: "", price: 0}}
                //     drink2={{category: "Boisson 2", name: "", price: 0}}
                //     price={0}
                //     onMenuUpdate={(menuUpdated) => handleMenuUpdate(menuUpdated)}
                //     editing={true}
                //     allowEdit={!isEditing}
                //     isOnEdition={(e) => setIsEditing(e)}
                // />
            )} */}
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

    return <BackNavPageGeneric title={"Evénement"} readyTables={1} children={event && card}/>;
}