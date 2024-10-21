import React, { useState } from 'react';
import { Button, Card, CardContent, CardMedia, Typography, Grid, BottomNavigation, BottomNavigationAction } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import DessertIcon from '@mui/icons-material/Cake';
import StarIcon from '@mui/icons-material/Star';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import PersonIcon from '@mui/icons-material/Person'; // Import de l'icône Person
import { useNavigate } from 'react-router-dom'; // Import de useNavigate

// Données initiales du menu
const initialMenuItems = [
  { id: 1, name: 'Salade César', price: 8, img: 'path_to_image_salad', type: 'starters' },
  { id: 2, name: 'Soupe à l’oignon', price: 7, img: 'path_to_image_soup', type: 'starters' },
  { id: 3, name: 'Pâtes bolo', price: 12, img: 'path_to_image_bolo', type: 'mains' },
  { id: 4, name: 'Pâtes carbo', price: 12, img: 'path_to_image_carbo', type: 'mains' },
  { id: 5, name: 'Escalope de veau', price: 14, img: 'path_to_image_escalope', type: 'mains' },
  { id: 6, name: 'Coca-Cola', price: 3, img: 'path_to_image_coca', type: 'drinks' },
  { id: 7, name: 'Eau Minérale', price: 2, img: 'path_to_image_water', type: 'drinks' },
  { id: 8, name: 'Tiramisu', price: 6, img: 'path_to_image_tiramisu', type: 'desserts' },
  { id: 9, name: 'Crème Brûlée', price: 6, img: 'path_to_image_creme_brulee', type: 'desserts' },
  { id: 10, name: 'Plat du Jour', price: 16, img: 'path_to_image_special', type: 'specials' },
];

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState(initialMenuItems); 
  const [cart, setCart] = useState<{ id: number; name: string; price: number; img: string }[]>([]);
  const [total, setTotal] = useState(0);
  const [navValue, setNavValue] = useState('starters');  
  const navigate = useNavigate(); 

  const addToCart = (item: { id: number; name: string; price: number; img: string }) => {
    setCart([...cart, item]);
    setTotal(total + item.price);

    const updatedMenuItems = menuItems.filter(menuItem => menuItem.id !== item.id);
    setMenuItems(updatedMenuItems);
  };

  const filteredItems = menuItems.filter(item => item.type === navValue);

  const handleProfileClick = () => {
    navigate('/profile'); 
  };

  return (
    <div style={{ padding: '20px' }}>
      <Grid container spacing={3}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={4} key={item.id}>
            <Card>
              <CardMedia component="img" height="140" image={item.img} alt={item.name} />
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2">Price: {item.price}€</Typography>
                <Button variant="contained" onClick={() => addToCart(item)}>
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Typography variant="h5">Total: {total}€</Typography>
        <Button variant="contained" color="primary">
          Pay {total}€
        </Button>
      </div>

      {/* Bouton avec l'icône de personne pour rediriger vers une autre route */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<PersonIcon />}
          onClick={handleProfileClick}
        >
          Profile
        </Button>
      </div>

      <BottomNavigation
        value={navValue}
        onChange={(event, newValue) => setNavValue(newValue)}
        showLabels
        style={{ marginTop: '20px' }}
      >
        <BottomNavigationAction label="Starters" icon={<FastfoodIcon />} value="starters" />
        <BottomNavigationAction label="Mains" icon={<RestaurantIcon />} value="mains" />
        <BottomNavigationAction label="Desserts" icon={<DessertIcon />} value="desserts" />
        <BottomNavigationAction label="Drinks" icon={<LocalBarIcon />} value="drinks" />
        <BottomNavigationAction label="Specials" icon={<StarIcon />} value="specials" />
      </BottomNavigation>
    </div>
  );
}
