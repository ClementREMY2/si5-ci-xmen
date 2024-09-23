// src/components/MenuCard/MenuItemBox.tsx
import React, { useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { MenuItem } from '../../interfaces/MenuItem';

interface MenuItemBoxProps {
  menuItem: MenuItem;
  isEditing: boolean;
  onChanges: (menuItem: MenuItem) => void;
}

const MenuItemBox: React.FC<MenuItemBoxProps> = ({ menuItem, isEditing, onChanges }) => {
  const [editedName, setEditedName] = useState(menuItem.name);
  const [editedPrice, setEditedPrice] = useState(menuItem.price);

  const handleChanges = (label: string, value: any) => {
    if (label === "name") {
      setEditedName(value);
    }
    if (label === "price") {
      setEditedPrice(value);
    }
    const updatedMenuItem = { ...menuItem, name: editedName, price: editedPrice };
    onChanges(updatedMenuItem);
  }  

  return (
    <Box display="flex" alignItems="center">
      <Typography sx={{ fontWeight: 'bold', flexBasis: '20%' }}>{menuItem.type}</Typography>
      {isEditing ? (
        <>
          <TextField
            label="Nom"
            value={editedName}
            onChange={(e) => handleChanges("name", e.target.value)}
            sx={{ marginRight: 1 }}
          />
          <TextField
            label="Prix"
            type="number"
            value={editedPrice}
            onChange={(e) => handleChanges("price", Number(e.target.value))}
            sx={{ marginRight: 1 }}
          />
        </>
      ) : (
        <>
          <Typography >{editedName} - {editedPrice}€</Typography>
        </>
      )}
    </Box>
  );
};

export default MenuItemBox;