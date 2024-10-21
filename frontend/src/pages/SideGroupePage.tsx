import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Typography, Box, Badge } from '@mui/material';
import LocalBarIcon from '@mui/icons-material/LocalBar'; // Drinks
import RestaurantIcon from '@mui/icons-material/Restaurant'; // Mains
import DessertIcon from '@mui/icons-material/Cookie'; // Desserts
import FastfoodIcon from '@mui/icons-material/Fastfood'; // Starters
import AllInclusiveIcon from '@mui/icons-material/AllInclusive'; // All
import StarIcon from '@mui/icons-material/Star'; // Assurez-vous d'importer l'icône Star
import FilterListIcon from '@mui/icons-material/FilterList'; // For the item count display

// Mocks des items
const mockItems = [
  { id: 1, name: 'Salade César', price: 8, type: 'starters' },
  { id: 2, name: 'Soupe du jour', price: 6, type: 'starters' },
  { id: 3, name: 'Pâtes bolo', price: 12, type: 'mains' },
  { id: 4, name: 'Pâtes carbo', price: 12, type: 'mains' },
  { id: 5, name: 'Escalope veau', price: 14, type: 'mains' },
  { id: 6, name: 'Coca-Cola', price: 3, type: 'drinks' },
  { id: 7, name: 'Eau Minérale', price: 2, type: 'drinks' },
  { id: 8, name: 'Tiramisu', price: 6, type: 'desserts' },
  { id: 9, name: 'Crème Brûlée', price: 6, type: 'desserts' },
];

export default function VerticalNav() {
  const [navValue, setNavValue] = useState('all');
  const [total, setTotal] = useState(0);

  const filteredItems = navValue === 'all' ? mockItems : mockItems.filter(item => item.type === navValue);

  const totalCategoryPrice = filteredItems.reduce((sum, item) => sum + item.price, 0);

  const itemCount = filteredItems.length;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: '#333',
        color: '#fff',
        height: '100vh',
        paddingTop: 2,
        paddingBottom: 2,
        justifyContent: 'space-between',
      }}
    >

      {/* Barre de navigation verticale */}
      <BottomNavigation
        value={navValue}
        onChange={(event, newValue) => setNavValue(newValue)}
        showLabels
        sx={{
          backgroundColor: '#333',
        }}
      >
        <BottomNavigationAction
          label="All"
          icon={
            <Badge badgeContent={mockItems.length} color="primary">
              <AllInclusiveIcon sx={{ color: '#00bcd4' }} />
            </Badge>
          }
          sx={{ color: '#00bcd4' }}
          value="all"
        />
        <BottomNavigationAction
          label="Drinks"
          icon={
            <Badge badgeContent={mockItems.filter(item => item.type === 'drinks').length} color="primary">
              <LocalBarIcon sx={{ color: '#ff9800' }} />
            </Badge>
          }
          sx={{ color: '#ff9800' }}
          value="drinks"
        />
        <BottomNavigationAction
          label="Starters"
          icon={
            <Badge badgeContent={mockItems.filter(item => item.type === 'starters').length} color="primary">
              <FastfoodIcon sx={{ color: '#ff9800' }} />
            </Badge>
          }
          sx={{ color: '#ff9800' }}
          value="starters"
        />
        <BottomNavigationAction
          label="Mains"
          icon={
            <Badge badgeContent={mockItems.filter(item => item.type === 'mains').length} color="primary">
              <RestaurantIcon sx={{ color: '#ff9800' }} />
            </Badge>
          }
          sx={{ color: '#ff9800' }}
          value="mains"
        />
        <BottomNavigationAction
          label="Desserts"
          icon={
            <Badge badgeContent={mockItems.filter(item => item.type === 'desserts').length} color="primary">
              <DessertIcon sx={{ color: '#ff9800' }} />
            </Badge>
          }
          sx={{ color: '#ff9800' }}
          value="desserts"
        />
        <BottomNavigationAction
          label="Special Menus"
          icon={
            <Badge badgeContent={mockItems.filter(item => item.type === 'special').length} color="primary">
              <StarIcon sx={{ color: '#ff9800' }} />
            </Badge>
          }
          sx={{ color: '#ff9800' }}
          value="special"
        />
      </BottomNavigation>

      {/* Affichage du prix total de la catégorie sélectionnée */}
      <Box
        sx={{
          flex: 1,
          width: '100%',
          padding: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" align="center">
          Prix total: {totalCategoryPrice}€ ({itemCount} items)
        </Typography>
      </Box>
    </Box>
  );
}
