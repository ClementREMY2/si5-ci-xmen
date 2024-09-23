import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {Box, Button, Checkbox, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import BackNavPageGeneric from "../components/generics/BackNavPageGeneric.tsx";
import MenuCard from "../components/MenuCard/MenuCard";
import {privateRoutes} from "../utils/Routes.ts";

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

    const menus = [
        {
            title: "Menu classique",
            entree: {category: "Entrée", name: "Salade", price: 5},
            mainCourse: {category: "Plat", name: "Steak frites", price: 15},
            dessert: {category: "Dessert", name: "Tarte aux pommes", price: 7},
            drink1: {category: "Boisson 1", name: "Vin rouge", price: 10},
            drink2: {category: "Boisson 2", name: "Café", price: 3},
            price: 30
        },
        {
            title: "Menu enfant",
            entree: {category: "Entrée", name: "Soupe", price: 4},
            mainCourse: {category: "Plat", name: "Poulet rôti", price: 14},
            dessert: {category: "Dessert", name: "Mousse au chocolat", price: 6},
            drink1: {category: "Boisson 1", name: "Bière", price: 5},
            drink2: {category: "Boisson 2", name: "Thé", price: 2},
            price: 27
        },
        {
            title: "Menu végétarien",
            entree: {category: "Entrée", name: "Bruschetta", price: 6},
            mainCourse: {category: "Plat", name: "Pâtes", price: 12},
            dessert: {category: "Dessert", name: "Tiramisu", price: 8},
            drink1: {category: "Boisson 1", name: "Vin blanc", price: 9},
            drink2: {category: "Boisson 2", name: "Limonade", price: 3},
            price: 28
        }
    ];

    const ev = {
        name: "Soirée d'entreprise - Avisto",
        date: "2022-12-31",
        groupOrders: false,
        menus: menus
    };

    const [event, setEvent] = useState(ev);


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
                    title={menu.title}
                    entree={menu.entree}
                    mainCourse={menu.mainCourse}
                    dessert={menu.dessert}
                    drink1={menu.drink1}
                    drink2={menu.drink2}
                    price={menu.price}
                    onMenuUpdate={(menuUpdated) => handleMenuUpdate(menuUpdated)}
                    editing={false}
                    allowEdit={!isEditing}
                    isOnEdition={(e) => handleIsOnEdition(e)}
                />
            ))}
            {isANewMenu && (
                <MenuCard
                    title={""}
                    entree={{category: "Entrée", name: "", price: 0}}
                    mainCourse={{category: "Plat", name: "", price: 0}}
                    dessert={{category: "Dessert", name: "", price: 0}}
                    drink1={{category: "Boisson 1", name: "", price: 0}}
                    drink2={{category: "Boisson 2", name: "", price: 0}}
                    price={0}
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