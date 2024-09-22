import React, {useState} from 'react';
import MenuCard from '../components/MenuCard/MenuCard';
import { Button } from '@mui/material';

const EventsPage: React.FC = () => {
  const [isEdited, setIsEdited] = useState(false);
  const menus = [
    {
      entree: { type: 'Entrée', name: 'Salade', price: 5 },
      mainCourse: { type: 'Plat', name: 'Steak frites', price: 15 },
      dessert: { type: 'Dessert', name: 'Tarte aux pommes', price: 7 },
      drink1: { type: 'Boisson 1', name: 'Vin rouge', price: 10 },
      drink2: { type: 'Boisson 2', name: 'Café', price: 3 },
      price: 30,
    },
    {
      entree: { type: 'Entrée', name: 'Soupe', price: 4 },
      mainCourse: { type: 'Plat', name: 'Poulet rôti', price: 14 },
      dessert: { type: 'Dessert', name: 'Mousse au chocolat', price: 6 },
      drink1: { type: 'Boisson 1', name: 'Bière', price: 5 },
      drink2: { type: 'Boisson 2', name: 'Thé', price: 2 },
      price: 27,
    },
    {
      entree: { type: 'Entrée', name: 'Bruschetta', price: 6 },
      mainCourse: { type: 'Plat', name: 'Pâtes', price: 12 },
      dessert: { type: 'Dessert', name: 'Tiramisu', price: 8 },
      drink1: { type: 'Boisson 1', name: 'Vin blanc', price: 9 },
      drink2: { type: 'Boisson 2', name: 'Limonade', price: 3 },
      price: 28,
    },
  ];


  const handleMenuUpdate = (e: any) => {
    console.log(e);
    setIsEdited(true);
  }

  return (
    <div>
      <h1>Events Page</h1>
      {menus.map((menu, index) => (
        <MenuCard
          key={index}
          entree={menu.entree}
          mainCourse={menu.mainCourse}
          dessert={menu.dessert}
          drink1={menu.drink1}
          drink2={menu.drink2}
          price={menu.price}
          onMenuUpdate={(menuUpdated) => handleMenuUpdate(menuUpdated)}
        />
      ))}
      <Button disabled={!isEdited} >Modifier les menus</Button>
    </div>
  );
}

export default EventsPage;