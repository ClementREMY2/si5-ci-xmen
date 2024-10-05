// src/components/MenuCard/MenuCard.tsx
import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check'; 
import { MenuCardProps } from '../../interfaces/MenuCardProps';
import MenuItemBox from '../MenuItemBox/MenuItemBox';

const MenuCard: React.FC<MenuCardProps> = ({ title, entree, mainCourse, dessert, drink1, drink2, price, onMenuUpdate, editing, allowEdit, isOnEdition }) => {
  const [isEditing, setIsEditing] = useState(editing);
  const [editedMenu, setEditedMenu] = useState({ title, entree, mainCourse, dessert, drink1, drink2, price });
  const calculateTotalPrice = (): number => {
    return editedMenu.entree.price + editedMenu.mainCourse.price + editedMenu.dessert.price + editedMenu.drink1.price + editedMenu.drink2.price;
  };
  const [totalPrice, setTotalPrice] = useState(calculateTotalPrice());


  const handleEdit = () => {
    setIsEditing(!isEditing);
    isOnEdition(true);
  };

  const handleDelete = () => {
    // Logique pour supprimer la carte
  };

  const handleSave = () => {
    setIsEditing(false);
    const updatedMenu = { ...editedMenu
    };
    setTotalPrice(calculateTotalPrice());
    onMenuUpdate(updatedMenu);
  };

  const handleChangeTitle = (e: any) => {
    setIsEditing(true);
    setEditedMenu({ ...editedMenu, title: e });
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number(e.target.value);
    console.log('Input value:', e.target.value);
    console.log('New price:', newPrice);
    setEditedMenu((prevMenu) => ({
      ...prevMenu,
      price: newPrice,
    }));
  };

  const handleChangesInItem = (menuItem: any) => {
    const mapping: { [key: string]: string } = {
      'Entrée': 'entree',
      'Plat': 'mainCourse',
      'Dessert': 'dessert',
      'Boisson 1': 'drink1',
      'Boisson 2': 'drink2',
    };
    const updatedMenu = { ...editedMenu, [mapping[menuItem.type]]: menuItem };
    setEditedMenu(updatedMenu);
  }
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
                <IconButton onClick={handleEdit} sx={{ marginRight: 1 }} disabled={!allowEdit}>
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
              <MenuItemBox menuItem={item} isEditing={isEditing} onChanges={(menuItem) => handleChangesInItem(menuItem)} />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ marginRight: 1 }}>Prix Total Réel: {totalPrice}€</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ marginRight: 1 }}>Prix Affiché:</Typography>
            {isEditing ? (
              <TextField
                value={editedMenu.price}
                onChange={
                  handlePriceChange
                }
                variant="outlined"
                size="small"
                type="number"
              />
            ) : (
              <Typography variant="h5">{editedMenu.price}€</Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MenuCard;