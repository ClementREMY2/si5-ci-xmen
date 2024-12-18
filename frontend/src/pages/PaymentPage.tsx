import icon from "@mui/icons-material/icon";
import { ListItem, ListItemIcon, Typography, Divider, Stack, List, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuantityButtonsGeneric from "../components/generics/QuantityButtonsGeneric";
import { LocalBar, Tapas, Restaurant, Cookie } from "@mui/icons-material";
import { menuNormalMock } from "../mocks/Menu";
import { Table } from "react-bootstrap";
import TableMainCard from "../components/generics/TableMainCard";

interface Order {
    _id: string;
    tableNumber: number;
    customerName?: string;
    event?: string;
    customersCount: number;
    opened: string;
    preparations: string[];
    billed?: string | null;
}

interface MenuItem {
    _id: string;
    fullName: string;
    shortName: string;
    price: number;
    category: string;
}


export default function PaymentPage() {

    const [order, setOrder] = useState<Order>();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isBilled, setIsBilled] = useState<boolean>(false);

    const {orderId} = useParams(); 



    useEffect(() => {
    const getOrder = async () => {
        console.log("orderId", orderId);
        const response = await fetch(`http://localhost:9500/dining/tableOrders/${orderId}`);
        const orderData = await response.json();
        setOrder(orderData);
    }
    getOrder();
    }, [orderId]);

    const getMenuItem = (preparation: string) => {
        const menuItem = menuItems.find(item => item._id === preparation);
        return menuItem 
    }

    const getTypeOrder = () => {
        if(order?.tableNumber) return "table";
        if(order?.event) return "event";
    }

    const getPaymentMessage = (orderType: string) => {
        if(orderType === "table") return "Payement terminé, merci.";
        if(orderType === "event") return "Evénement payé, retour au payement de la table.";
    }


    const handlePayment = () => {
        const billOrder = async () => {
            if (!orderId) return;
            const response = await fetch(`http://localhost:3005/orders/billOrder/${orderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId }),
            });
            if (response.ok) {
                console.log("Order billed successfully");
                setIsBilled(true);
            } else {
                console.error("Failed to bill order");
            }
        };

        billOrder();
    }

    const getIcon = (menuItem: MenuItem): React.ReactElement | undefined => {
        switch (menuItem?.category) {
            case "BEVERAGE": return <LocalBar color={"primary"}/>;
            case "STARTER": return <Tapas color={"primary"}/>;
            case "MAIN": return <Restaurant color={"primary"}/>;
            case "DESSERT": return <Cookie color={"primary"}/>;
            default: return undefined;
        }
    }

    useEffect(() => {
        const fetchMenuItems = async () => {
            const response = await fetch("http://localhost:9500/menu/menus");
            const data = await response.json();
            setMenuItems(data);
        }
        setIsBilled(order?.billed !== null);
        fetchMenuItems();
    }, [order])


    return (
        <div>
            <TableMainCard>
            {!isBilled && (
                <>
                    <Typography variant={"h5"}>{`Payement de l'événement ${order?.event}`}</Typography>
                    <List sx={{height: "100%", overflowY: "auto"}}>
                    {order?.preparations.map((preparation, index) => {
                        const menuItem = getMenuItem(preparation);
                        return (
                                <>
                                <ListItem key={index}>
                                    <Stack direction={"row"} alignItems={"center"} spacing={2} width={"100%"}>
                                        <ListItemIcon>{getIcon(menuItem!)}</ListItemIcon>
                                        <Typography flex={3.5}>{menuItem?.shortName}</Typography>
                                        <Typography flex={1}>{menuItem?.price} €</Typography>
                                    </Stack>
                                </ListItem>
                                <Divider component={"li"}/>
                                </>
                            );
                        })}
                    </List>
                    <Stack direction={"row"} justifyContent={"space-between"} padding={2}>
                        <Typography variant={"h6"}>Total</Typography>
                        <Typography variant={"h6"}>{order?.preparations.reduce((total, preparation) => {
                            const menuItem = getMenuItem(preparation);
                            return total + (menuItem?.price || 0);
                        }, 0)} €</Typography>
                    </Stack>
                    <Stack direction={"row"} justifyContent={"center"} padding={2}>
                        <Button variant="contained" color="primary" onClick={handlePayment}>
                            Payer
                        </Button>
                    </Stack>
                </>
            )}
            {isBilled && (
                <Stack direction={"row"} justifyContent={"center"} padding={2}>
                    <Stack direction={"column"} alignItems={"center"} justifyContent={"center"} height={"100%"} spacing={2}>
                        <Typography variant={"h5"}>{getPaymentMessage(getTypeOrder()!)}</Typography>
                        <Button variant="contained" color="secondary" onClick={() => console.log("Retour à la table")}>
                            Retour à la table
                        </Button>
                    </Stack>
                </Stack>
            )}
            </TableMainCard>
        </div>
    );
}

// import {Box, Button} from "@mui/material";
// import React, {useEffect, useState} from "react";
// import {useNavigate, useParams} from "react-router-dom";
// import {toast} from "react-toastify";
// import ActionCardGeneric from "../components/generics/ActionCardGeneric.tsx";
// import BackNavPageGeneric from "../components/generics/BackNavPageGeneric.tsx";
// import PaymentList from "../components/payment/PaymentList.tsx";
// import {Event} from "../interfaces/Event.ts";
// import {GenericMenuItem, MenuBackendNoId, MenuEvent, MenuItem} from "../interfaces/Menu.ts";
// import {Order} from "../interfaces/Order.ts";
// import {Table, TableStatusEnum} from "../interfaces/Table.ts";
// import {eventsMock} from "../mocks/Event.ts";
// import {tablesMock} from "../mocks/Tables.ts";
// import {checkEventName, checkTableNumber} from "../utils/PageUtils.ts";
// import {privateRoutes} from "../utils/Routes.ts";
// import { getEventOrders, getTableOrders, savePayment } from "../services/OrderService.ts";
// import { getMenuItemById } from "../services/MenuItemsService.ts";
// import { addMenu } from "../services/MenuService.ts";
// import { getMenus } from "../formatter/MenuFormatter.ts";
// import { getTables } from "../formatter/TableFormatter.ts";
// import { getEvents } from "../services/EventService.ts";

// const findTable = (tables: Table[], tableNumber?: string): Table | undefined => {
//     if (!checkTableNumber(tableNumber, false)) return undefined;
    
//     return tables.find(table => table.table === parseFloat(tableNumber!));
// };


// const getNbReadyTables = () => tablesMock.filter(table => table.status === TableStatusEnum.ORDER_READY).length;
// const navigate = useNavigate();
//     const {table: tableNumber, event: eventName} = useParams();
//     const [menus, setMenus] = useState<GenericMenuItem[]>([]);
//     const [tables, setTables] = useState<Table[]>([]);
//     const [table, setTable] = useState<Table | undefined>(undefined);
//     const [event, setEvent] = useState<Event | undefined>(undefined);
//     const [events, setEvents] = useState<Event[]>(eventsMock);

    
//     // Loading asynchronously the menus
//     useEffect(() => {
//         const fetchMenus = async () => {
//             const fetchMenus = await getMenus();
//             setMenus(fetchMenus);
//         };

//         const fetchEvents = async () => {
//             const fetchEvents = await getEvents();
//             setEvents(fetchEvents);
//         }

//         fetchEvents();

//         fetchMenus();
//     }, []);

//     // Loading asynchronously the tables
//     useEffect(() => {
//         const fetchTables = async () => {
//             const fetchTables = await getTables();
//             setTables(fetchTables);
//         };

//         fetchTables();


//     }, []);

//     // Loading asynchronously the tables
//     useEffect(() => {
//         const fetchTables = async () => {
//             const e = events.find(e => e.name === eventName);
//             console.log(e);
//             console.log(findTable(tables, tableNumber));
//             setTable(findTable(tables, tableNumber));
//             setEvent(e);
//         };

//         fetchTables();
//     }, [tables, events]);


//     useEffect(() => {
//         const fetchOrder = async () => {
         
            
//             if (!table && !event) {
//                 console.warn("No table found for table number:", tableNumber, "and no event found for name:", eventName,
//                     "=> redirecting to home page");
//                 //navigate(privateRoutes.home);
//             } else if (table && event) {
//                 console.warn("Can't have table and event for payment, redirecting to home page");
//                 navigate(privateRoutes.home);
//             } else if (table && !event) {
//                 const order = await getTableOrders(table.table);
//                 console.log(order);
//                 setOrder(order);
//             } else if (!table && event) {
//                 if(event.id)
//                     setOrder(await getEventOrders(event.id));
//             }
//         };   
//         fetchOrder();

//     }, [table, event]);
    

//     // useEffect(() => {
        

//     // }, [navigate, tableNumber, table, eventName, event, tables]);

//     const [order, setOrder] = useState<Order>({total: 0, items: {}, itemsEvent: {}, datetime: new Date()});


//     useEffect(() => {
        
//     }   , [order]);
//     const [paying, setPaying] = useState<Order>({
//         total: 0,
//         items: {},
//         itemsEvent: {},
//         datetime: new Date()
//     });
//     const [paid, setPaid] = useState<Order>({
//         total: 0,
//         items: {},
//         itemsEvent: {},
//         datetime: new Date()

//     });
//     const [tip, setTip] = useState<number>(0);

//     const getItem = async (id: string, isEventMenu: boolean): Promise<MenuItem | MenuEvent | undefined> => {
//         if (isEventMenu) return event?.menus.find(menu => menu.id === id);
//         if (event) return event?.beverages.find(item => item.id === id);
//         return await getMenuItemById(id);
//     };

//     const getNewQuantity = (id: string, delta: number, isEventMenu: boolean): number => {
//         const items = isEventMenu ? paying.itemsEvent! : paying.items!;
//         return (items[id] || 0) + delta;
//     };

//     const changePayingQuantity = async (id: string, delta: number, isEventMenu: boolean = false) => {
//         // Find the item in the menu
//         const item = await getItem(id, isEventMenu);
//         if (!item) {
//             console.warn(`Cannot find item with id: ${id}`);
//             return;
//         }

//         // Update the quantity
//         const newQuantity = getNewQuantity(id, delta, isEventMenu);
//         if (newQuantity < 0) {
//             console.warn(`Cannot have negative quantity: ${item.fullName} = ${newQuantity}`);
//             return;
//         }

//         // Update the order
//         const newPaying = {...paying, total: paying.total + item.price * delta};
//         if (isEventMenu) newPaying.itemsEvent = {...paying.itemsEvent, [id]: newQuantity};
//         else newPaying.items = {...paying.items, [id]: newQuantity};
//         setPaying(newPaying);
//     };

//     const addAllToPaying = (checked: boolean) => {
//         if (!checked) {
//             removeAllFromPaying();
//             return;
//         }

//         const newPaying = {...order, total: order.total - paid.total};
//         if (newPaying.items && paid.items) {
//             Object.entries(paid.items).forEach(([id, quantity]) => {
//                 newPaying.items![id] -= quantity;
//             });
//         }
//         if (newPaying.itemsEvent && paid.itemsEvent) {
//             Object.entries(paid.itemsEvent).forEach(([id, quantity]) => {
//                 newPaying.itemsEvent![id] -= quantity;
//             });
//         }
//         setPaying(newPaying);
//     };

//     const removeAllFromPaying = () => {
//         setPaying({total: 0, items: {}, itemsEvent: {}, table: 0, datetime: new Date()});
//     };

//     const handlePayment = async () => {
//         const total = paid.total + paying.total;
//         let payment = {
//             table: order.table ?? 0,
//             date: new Date(new Date().getTime() - 2 * 60 * 60 * 1000), // Subtracting 2 hours
//             items: paying.items ?? {},
//             itemsEvent: paying.itemsEvent ?? {},
//             ended: total === order.total,
//             event: event?.id
//         };

//         console.log(payment);
//         savePayment(payment);
//         toast.success("Paiement terminé!");
//         let tables: Table[] = [];
//         if(event){
//             tables = await getTables();
//             console.log(tables);
//             const newMenus: MenuBackendNoId[] = [];
//             tables.forEach(table => {
//                 if(table.event === event.name){
//                     newMenus.push({
//                         fullName: "_|" + table.table + "|" + table.nbPeople + "|" + table.event + "|" + TableStatusEnum.AVAILABLE,
//                         shortName: menus.length + "|" + table.table + "|" + table.nbPeople + "|" + table.event + "|" + TableStatusEnum.AVAILABLE,
//                         price: 1,
//                         category: "DESSERT",
//                         image: "https://cdn.pixabay.com/photo/2016/11/12/15/28/restaurant-1819024_960_720.jpg"
//                     });
//                 }
//             });
//             newMenus.forEach(menu => addMenu(menu));
//         }
//         const newMenu: MenuBackendNoId = {
//             fullName: "_|" + order.table + "|" + table?.nbPeople + "|" + table?.event + "|" + TableStatusEnum.AVAILABLE,
//             shortName: menus.length + "|" + order.table + "|" + table?.nbPeople + "|" + table?.event + "|" + TableStatusEnum.AVAILABLE,
//             price: 1,
//             category: "DESSERT",
//             image: "https://cdn.pixabay.com/photo/2016/11/12/15/28/restaurant-1819024_960_720.jpg"
//         }
//         addMenu(newMenu);
//         navigate(privateRoutes.home);
        
//         const newPaid = {...paid, total};

//         // Copy the items from paying to paid
//         Object.entries(paying.items!).forEach(([id, quantity]) => {
//             if (quantity > 0) {
//                 newPaid.items![id] = (newPaid.items![id] || 0) + quantity;
//             }
//         });
//         Object.entries(paying.itemsEvent!).forEach(([id, quantity]) => {
//             if (quantity > 0) {
//                 newPaid.itemsEvent![id] = (newPaid.itemsEvent![id] || 0) + quantity;
//             }
//         });

//         setPaid(newPaid);
//         removeAllFromPaying();
//     };

//     const card: React.ReactNode = (
//         <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} height={"100%"}>
//             <ActionCardGeneric
//                 title={order.table ? `Table ${order.table}` : `Événement ${event?.name}`}
//                 rightTitle={`${paid.total} € / ${order.total} €`}
//                 mainContent={<PaymentList order={order} paying={paying} changePayingQuantity={changePayingQuantity}
//                                           addAllToPaying={addAllToPaying} paid={paid} tip={tip} changeTip={setTip}/>}
//                 buttons={
//                     <Button onClick={handlePayment} variant={"contained"} sx={{width: "200px"}}>
//                         Payer {paying.total + (isNaN(tip) ? 0 : tip)} €
//                     </Button>
//                 }
//                 minWidth={"95%"}
//                 minHeight={"95%"}
//             />
//         </Box>
//     );

//     return <BackNavPageGeneric title={"Paiement"} readyTables={getNbReadyTables()} children={card}/>;