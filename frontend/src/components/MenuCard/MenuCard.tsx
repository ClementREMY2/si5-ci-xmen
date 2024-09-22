// src/components/MenuCard/MenuCard.tsx
import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check'; 
import { MenuCardProps } from '../../interfaces/MenuCardProps';
import MenuItemBox from '../MenuItemBox/MenuItemBox';

const MenuCard: React.FC<MenuCardProps> = ({ title, entree, mainCourse, dessert, drink1, drink2, price, onMenuUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMenu, setEditedMenu] = useState({ title, entree, mainCourse, dessert, drink1, drink2, price });
  const calculateTotalPrice = (): number => {
    return entree.price + mainCourse.price + dessert.price + drink1.price + drink2.price;
  };

  const totalPrice = calculateTotalPrice();

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleDelete = () => {
    // Logique pour supprimer la carte
  };

  const handleSave = () => {
    setIsEditing(false);
    const updatedMenu = { ...editedMenu
    };
    onMenuUpdate(updatedMenu);
  };

  const handleChangeTitle = (e: any) => {
    setIsEditing(true);
    setEditedMenu({ ...editedMenu, title: e });
  }

  const removeAccents = (str: string): string => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  return (
    <Card sx={{ margin: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {isEditing ? (
            <TextField
              value={editedMenu.title}
              onChange={(e) => handleChangeTitle(e.target.value)}
              variant="outlined"
              size="small"
            />
          ) : (
            <Typography variant="h5">{editedMenu.title}</Typography>
          )}
          <Box>
            {isEditing ? (
              <IconButton onClick={handleSave} sx={{ marginRight: 1 }}>
                <CheckIcon />
              </IconButton>
            ) : (
              <>
                <IconButton onClick={handleEdit} sx={{ marginRight: 1 }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Box>
        <Grid container spacing={2}>
          {[entree, mainCourse, dessert, drink1, drink2].map((item, index) => (
            <Grid item xs={6} key={index}>
              <MenuItemBox menuItem={item} isEditing={isEditing} onChanges={(menuItem) => setEditedMenu({ ...editedMenu, [removeAccents(item.type.toLowerCase())]: menuItem })} />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ marginRight: 1 }}>Prix Total Réel: {totalPrice}€</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ marginRight: 1 }}>Prix Affiché: {price}€</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MenuCard;