import React, {useEffect, useState} from 'react';
import MenuCard from '../components/MenuCard/MenuCard';
import { Button, Box, Typography, Checkbox } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate, useParams } from 'react-router-dom';
import { privateRoutes } from '../utils/Routes';


const EventsPage: React.FC = () => {
    const [isEdited, setIsEdited] = useState(false);
    const [isANewMenu, setIsANewMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);


    const navigate = useNavigate();
    const {eventId} = useParams();

    useEffect(() => {
        if (eventId === undefined || isNaN(parseFloat(eventId))) {
            console.warn("No table specified, redirecting to home page");
            navigate(privateRoutes.home);
        }
    }, [navigate, eventId]);



  const menus = [
    {
      title: 'Menu classique',
      entree: { type: 'Entrée', name: 'Salade', price: 5 },
      mainCourse: { type: 'Plat', name: 'Steak frites', price: 15 },
      dessert: { type: 'Dessert', name: 'Tarte aux pommes', price: 7 },
      drink1: { type: 'Boisson 1', name: 'Vin rouge', price: 10 },
      drink2: { type: 'Boisson 2', name: 'Café', price: 3 },
      price: 30,
    },
    {
      title: 'Menu enfant',
      entree: { type: 'Entrée', name: 'Soupe', price: 4 },
      mainCourse: { type: 'Plat', name: 'Poulet rôti', price: 14 },
      dessert: { type: 'Dessert', name: 'Mousse au chocolat', price: 6 },
      drink1: { type: 'Boisson 1', name: 'Bière', price: 5 },
      drink2: { type: 'Boisson 2', name: 'Thé', price: 2 },
      price: 27,
    },
    {
      title: 'Menu végétarien',
      entree: { type: 'Entrée', name: 'Bruschetta', price: 6 },
      mainCourse: { type: 'Plat', name: 'Pâtes', price: 12 },
      dessert: { type: 'Dessert', name: 'Tiramisu', price: 8 },
      drink1: { type: 'Boisson 1', name: 'Vin blanc', price: 9 },
      drink2: { type: 'Boisson 2', name: 'Limonade', price: 3 },
      price: 28,
    },
  ];
  
  const ev = {
    name: "Soirée d'entreprise - Avisto",
    date: '2022-12-31',
    groupOrders: false,
    menus: menus
  };

  const [event, setEvent] = useState(ev);

  


  const handleMenuUpdate = (e: any) => {
    console.log(e);
    setIsEdited(true);
    setIsANewMenu(false);
    setIsEditing(false);
  }

  const handleSaveModifications = () => {
    console.log('Sauvegarde des modifications');
    setIsEdited(false);
    setIsEditing(false);
  }

  const handleCancelModifications = () => {
    console.log('Annulation des modifications');
    setIsEdited(false);
    setIsEditing(false);
  }

  const handleAddMenu = () => {
    console.log('Ajout d\'un menu');
    setIsANewMenu(true);
    setIsEditing(true);
  }


  const handleIsOnEdition = (e: boolean) => {
    setIsEditing(e);
    console.log(e);
  }

  return (
    <div>
      <Typography variant="h3" sx={{ marginRight: 1 }}>{event.name}</Typography>
      <Box display="flex" justifyContent="flex-start" alignItems="center" sx={{ marginLeft: 2 }} gap={2} mt={2}>
        <Typography>Date de l'événement</Typography>
        <input type="date" />
      </Box>
      <Box display="flex" justifyContent="flex-start" alignItems="center" sx={{ marginLeft: 2 }} gap={2} mt={2}>
        <Typography>Grouper commandes</Typography>
        <Checkbox></Checkbox>
      </Box>
      <Box display="flex" justifyContent="flex-start" sx={{ margin: 2 }} gap={2} mt={2}>
        <Button variant='contained' color='primary' disabled={isEditing} endIcon={<AddCircleOutlineIcon />} onClick={handleAddMenu}>
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
          entree={{ type: 'Entrée', name: '', price: 0 }}
          mainCourse={{ type: 'Plat', name: '', price: 0 }}
          dessert={{ type: 'Dessert', name: '', price: 0 }}
          drink1={{ type: 'Boisson 1', name: '', price: 0 }}
          drink2={{ type: 'Boisson 2', name: '', price: 0 }}
          price={0}
          onMenuUpdate={(menuUpdated) => handleMenuUpdate(menuUpdated)}
          editing={true}
          allowEdit={!isEditing}
          isOnEdition={(e) => setIsEditing(e)}
        />
      )}
      <Box display="flex" justifyContent="center" gap={2} mt={2}>
        <Button disabled={!isEdited} onClick={handleCancelModifications} variant='contained' color='error'>
          Annuler les modifications
        </Button>
        <Button disabled={!isEdited} onClick={handleSaveModifications} variant='contained' color='success'>
          Sauvegarder les modifications
        </Button>
      </Box>
   </div>
  );
}

export default EventsPage;