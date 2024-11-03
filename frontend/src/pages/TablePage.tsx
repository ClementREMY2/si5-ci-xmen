import React, { useEffect, useState } from 'react';
import TableMainCard from '../components/generics/TableMainCard';
import TableGrid from '../components/poc/TableGrid';
import UsersGrid from '../components/poc/UsersGrid';
import MenuItemsList from '../components/poc/MenuItemsList';
import Button from '@mui/material/Button';

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

interface Table {
    tableNumber: number;
    customerNames: string[];
    totalPrices: number[];
}

interface MenuItem {
    _id: string;
    fullName: string;
    price: number;
}

interface SelectedMenuItem {
    orderId: string;
    menuItems: string[];
}

const TablePage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [selectedTableOrders, setSelectedTableOrders] = useState<Order[] | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [selectedMenuItems, setSelectedMenuItems] = useState<SelectedMenuItem[] | null>(null);

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:3005/orders');
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const calculateTotalPrices = async () => {
        const updatedTables: Table[] = [];

        for (const order of orders) {
            const tableIndex = updatedTables.findIndex((table) => table.tableNumber === order.tableNumber);
            order.totalPrice = 0;

            const fetchMenuItemPrices = async () => {
                const prices = await Promise.all(
                    order.preparations.map(async (preparation: string) => {
                        const menuItem = await fetch(`http://localhost:9500/menu/menus/${preparation}`);
                        const menuItemData = await menuItem.json();
                        if (!menuItems.some(item => item._id === menuItemData.id)) {
                            setMenuItems(prevItems => [...prevItems, menuItemData]);
                        }
                        
                        return menuItemData.price;
                    })
                );
                const totalPrice = prices.reduce((total, price) => total + price, 0);
                
                return totalPrice;
            };

            const totalPrice = await fetchMenuItemPrices();
            order.totalPrice = totalPrice;
            

            if (tableIndex === -1) {
                updatedTables.push({
                    tableNumber: order.tableNumber,
                    customerNames: [order.customerName || ''],
                    totalPrices: [order.totalPrice || 0],
                });
            } else {
                updatedTables[tableIndex].customerNames.push(order.customerName || '');
                updatedTables[tableIndex].totalPrices.push(order.totalPrice || 0);
            }
        }
        const filteredTables = updatedTables.filter((table) => table.tableNumber !== undefined && table.tableNumber !== null);

        setTables(filteredTables);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        if (orders.length > 0) {
            calculateTotalPrices();
        }
        
    }, [orders]);

    const handleSelection = (tableNumber: number) => {
        const tableOrders = orders.filter((order) => order.tableNumber === tableNumber);
        setSelectedTableOrders(tableOrders);
    }


    const handleSelectItem = (orderId: string, menuItemId: string, isAdding: boolean) => {
        const selectedOrder = orders.find((order) => order._id === orderId);
        if (!selectedOrder) return;
        const selectedMenuItem = menuItems.find((menuItem) => menuItem._id === menuItemId);
        if (!selectedMenuItem) return;
        const selectedMenuItemsCopy = selectedMenuItems ? [...selectedMenuItems] : [];
        const orderIndex = selectedMenuItemsCopy.findIndex((item) => item.orderId === orderId);
        const ordersCopy = [...orders];

        if (orderIndex === -1) {
            if (isAdding) {
                selectedMenuItemsCopy.push({ orderId, menuItems: [selectedMenuItem._id] });
                ordersCopy.find((order) => order._id === orderId)!.preparations = ordersCopy.find((order) => order._id === orderId)!.preparations.filter((preparation, index) => index !== ordersCopy.find((order) => order._id === orderId)!.preparations.indexOf(selectedMenuItem._id));
            }
            else {
                ordersCopy.find((order) => order._id === orderId)!.preparations.push(selectedMenuItem._id);
            }
        } else {
            if (isAdding) {
                selectedMenuItemsCopy[orderIndex].menuItems.push(selectedMenuItem._id);
                ordersCopy.find((order) => order._id === orderId)!.preparations = ordersCopy.find((order) => order._id === orderId)!.preparations.filter((preparation, index) => index !== ordersCopy.find((order) => order._id === orderId)!.preparations.indexOf(selectedMenuItem._id));
            } else {
                selectedMenuItemsCopy[orderIndex].menuItems.splice(-1, 1);
                if (selectedMenuItemsCopy[orderIndex].menuItems.length === 0) {
                    selectedMenuItemsCopy.splice(orderIndex, 1);
                }
                ordersCopy.find((order) => order._id === orderId)!.preparations.push(selectedMenuItem._id);
            
            }
        }
        
        setSelectedMenuItems(selectedMenuItemsCopy);
        setOrders(ordersCopy);
    }

    useEffect(() => {
        
    }, [selectedMenuItems]);

    return (
        <div>
            <TableMainCard>
                <div style={{ display: 'flex' }}>
                    <div style={{ flex: 2, border: '1px solid #666', borderRadius: '10px', padding: '10px' }}>
                        {selectedTableOrders === null ? (
                            <>
                                <h1>Liste des tables de l'évenement</h1>
                                <TableGrid tables={tables} onSelection={handleSelection} />
                            </>
                        ) : (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h2>Selected Table Orders</h2>
                                    <Button variant="contained" color="secondary" onClick={() => setSelectedTableOrders(null)}>Retour à la liste des tables</Button>
                                </div>
                                <UsersGrid orders={selectedTableOrders} menuItems={menuItems} onClickItems={handleSelectItem} />
                            </div>
                        )}
                    </div>
                    <div style={{ width: '20px' }}></div>
                    <div style={{ flex: 1, border: '1px solid #666', borderRadius: '10px', padding: '10px' }}>
                        <h2>Liste d'éléments à payer par l'entreprise: </h2>
                        <MenuItemsList orders={orders} menuItems={menuItems} selectedMenuItems={selectedMenuItems} onClickItems={(orderId, itemId) => handleSelectItem(orderId, itemId, false)} />
                    </div>
                </div>
            </TableMainCard>
        </div>
    );
};

export default TablePage;