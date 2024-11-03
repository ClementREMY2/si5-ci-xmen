import { Button, ListItemButton, ListItemText } from "@mui/material";

interface SelectedMenuItem {
    orderId: string;
    menuItems: string[];
}

interface MenuItem {
    _id: string;
    fullName: string;
    price: number;
}

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

interface UsersGridProps {
    orders: Order[];
    menuItems: MenuItem[];
    selectedMenuItems: SelectedMenuItem[] | null;
    width?: string | number;
    onClickItems?: (orderId: string, menuItemId: string) => void;
}

export default function MenuItemsList({orders, menuItems, selectedMenuItems, onClickItems}: Readonly<UsersGridProps>) {

    const getMenuItem = (preparation: string) => {
        const menuItem = menuItems.find(item => item._id === preparation);
        return menuItem ? menuItem.fullName : preparation;
    }

    const getCustomerName = (orderId: string) => {
        const order = orders.find(order => order._id === orderId);
        return order ? order.customerName : "";
    }

    const getTableNumber = (orderId: string) => {
        const order = orders.find(order => order._id === orderId);
        return order ? order.tableNumber : "";
    }

    const getItemPrice = (preparation: string) => {
        const menuItem = menuItems.find(item => item._id === preparation);
        return menuItem ? menuItem.price : 0;
    }

    const handleClick = (orderId: string, menuItemId: string) => {
        if (onClickItems) {
            onClickItems(orderId, menuItemId);
        }
    }

    const groupSelectedItemsByTable = () => {
        const groupedItems: {[key: string]: { orderId: string, menuItemId: string }[]} = {};

        if (selectedMenuItems) {
            selectedMenuItems.forEach(selectedItem => {
                const tableNumber = getTableNumber(selectedItem.orderId);
                if (!groupedItems[tableNumber]) {
                    groupedItems[tableNumber] = [];
                }
                selectedItem.menuItems.forEach(menuItemId => {
                    groupedItems[tableNumber].push({ orderId: selectedItem.orderId, menuItemId });
                });
            });
        }

        return groupedItems;
    }

    const handlePayement = () => {
        const body = {
            items: selectedMenuItems
        };

        console.log(JSON.stringify(body));
        fetch('http://localhost:3005/orders/createEventOrder/avisto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            window.location.href = '/payment/poc/' + data._id;
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    }

    return (
        <div>
            {Object.entries(groupSelectedItemsByTable()).map(([tableNumber, items]) => (
            <div key={tableNumber}>
                <h3>Table {tableNumber}</h3>
                <ul>
                {items.map((item, index) => (
                    <li key={index}>
                    {getMenuItem(item.menuItemId)} - {getItemPrice(item.menuItemId)} €
                    <Button onClick={() => handleClick(item.orderId, item.menuItemId)}>Remove</Button>
                    </li>
                ))}
                </ul>
            </div>
            ))}
            <Button onClick={handlePayement}>Payer</Button>
        </div>
    );
}