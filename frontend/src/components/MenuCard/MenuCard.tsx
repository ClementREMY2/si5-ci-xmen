// src/components/MenuCard/MenuCard.tsx
import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check'; 
import { MenuCardProps } from '../../interfaces/MenuCardProps';
import MenuItemBox from '../MenuItemBox/MenuItemBox';

const MenuCard: React.FC<MenuCardProps> = ({ menu, onMenuUpdate, editing, allowEdit, isOnEdition }) => {
  const [isEditing, setIsEditing] = useState(editing);
  const [editedMenu, setEditedMenu] = useState({ ...menu });

  const calculateTotalPrice = (): number => {
    const items = Object.values(editedMenu.menu).filter((item) => item.price);
    return items.reduce((total, item) => total + item.price, 0);
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
    console.log('Updated menu:', updatedMenu);
    setTotalPrice(calculateTotalPrice());
    onMenuUpdate(updatedMenu);
  };

  const handleChangeTitle = (e: any) => {
    setIsEditing(true);
    setEditedMenu({ ...editedMenu, fullName: e });
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
    console.log('Menu item:', menuItem);
    let category = menuItem.category;
    if(category === "EntrC)e")
      category = "starter";
    if(category === "Plat")
      category = "main";
    if(category === "Dessert")
      category = "dessert";
    const updatedMenu = { ...editedMenu, menu: { ...editedMenu.menu, [category]: menuItem } };
    setEditedMenu(updatedMenu);
  }

  return (
    <Card sx={{ margin: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {isEditing ? (
            <TextField
              value={editedMenu.fullName}
              onChange={(e) => handleChangeTitle(e.target.value)}
              variant="outlined"
              size="small"
            />
          ) : (
            <Typography variant="h5">{editedMenu.fullName}</Typography>
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
          {Object.entries(menu.menu).map((item, index) => (
            <Grid item xs={6} key={index}>
              <MenuItemBox menuItem={item[1]} isEditing={isEditing} onChanges={(menuItem) => handleChangesInItem(menuItem)} />
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