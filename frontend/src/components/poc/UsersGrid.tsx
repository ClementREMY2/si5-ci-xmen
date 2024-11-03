import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, Grid2, ListItemButton, ListItemText, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Order {
    _id: string;
    tableNumber: number;
    customerName?: string;
    customersCount: number;
    opened: string;
    preparations: string[];
    billed?: string | null;
    totalPrice?: number;
  }

  interface MenuItem {
    _id: string;
    fullName: string;
    price: number;
    }

interface UsersGridProps {
    orders: Order[];
    menuItems: MenuItem[];
    width?: string | number;
    onClickItems?: (orderId: string, menuItemId: string, isAdding: boolean) => void;
}

export default function UsersGrid({orders, menuItems, width = "100%", onClickItems}: Readonly<UsersGridProps>) {

    const handleClick = (orderId: string, menuItemId: string, isChecked: boolean) => {
        if (onClickItems) {
            onClickItems(orderId, menuItemId, isChecked);
        }
    }


    const calculateTotalPrice = (order: Order) => {
        return order.preparations.reduce((acc, preparation) => {
            const menuItem = menuItems.find(item => item._id === preparation);
            
            return acc + (menuItem ? menuItem.price : 0);
        }, 0);
    }

    const getMenuItem = (preparation: string) => {
        const menuItem = menuItems.find(item => item._id === preparation);
        return menuItem ? menuItem.fullName : preparation;
    }

    return (
        <Grid2 container spacing={3} overflow={"auto"} sx={{ width }}>
        {orders.map((order) => (
          <Grid2 key={order._id} size={4}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${order._id}-content`}
                id={`panel-${order._id}-header`}
              >
                <Typography>
                  {order.customerName} - {calculateTotalPrice(order)} €
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                    {order.preparations.map((preparation, index) => {
                        const menuItem = menuItems.find(item => item._id === preparation);
                        const key = order._id + preparation + index;
                        return (
                            <ListItemButton key={key} >
                                <ListItemText primary={`${menuItem ? menuItem.fullName : preparation} - ${menuItem ? menuItem.price : 0} €`} />
                                <Button onClick={() => handleClick(order._id, preparation, true)}>Send</Button>
                            </ListItemButton>
                        );
                    })}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Grid2>
        ))}
      </Grid2>
    );
}