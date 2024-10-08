import {Box, Button} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import ActionCardGeneric from "../components/generics/ActionCardGeneric.tsx";
import BackNavPageGeneric from "../components/generics/BackNavPageGeneric.tsx";
import MenuEventList from "../components/order/MenuEventList.tsx";
import MenuList from "../components/order/MenuList.tsx";
import {Event} from "../interfaces/Event.ts";
import {Menu, MenuBackend, MenuBackendNoId, MenuCategoryEnum, MenuEvent, MenuItem} from "../interfaces/Menu.ts";
import {Order} from "../interfaces/Order.ts";
import {Table, TableStatusEnum} from "../interfaces/Table.ts";
import {checkTableNumber} from "../utils/PageUtils.ts";
import {privateRoutes} from "../utils/Routes.ts";
import { applyTableColors, getTables } from "../formatter/TableFormatter.ts";
// import { getAllMenuItem } from "../formatter/MenuFormatter.ts";
import { addMenu, getMenusGateway } from "../services/MenuService.ts";
import { getMenuItems } from "../services/MenuItemsService.ts";
import { createOrder } from "../services/OrderService.ts";
import { usePopup } from "../components/PopupContext";
import { getEvents } from "../services/EventService.ts";


export default function OrderPage() {
    const [tables, setTables] = useState<Table[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [menus, setMenus] = useState<MenuBackend[]>([]);
    const { setPopup } = usePopup();
    const [table, setTable] = useState<Table>();
    const [event, setEvent] = useState<Event>();

    useEffect(() => {
        const fetchMenus = async () => {
            const menusData = await getMenusGateway();
            setMenus(menusData);
        };

        const fetchTable = async () => {
            const tableData = await getTables();
            const t = tableData.find(t => t.table === parseFloat(tableNumber!));
            
            setTable(t);
        }

        fetchTable();
        fetchMenus();
    }, []);


    // pas compris pourquoi on doit faire ca, et ca casse le deuxieme useEffect pour les menuItems
    // useEffect(() => {
    //     const fetchTables = async () => {
    //         const tablesData = await getTables();
    //         setTables(tablesData);
    //     };
    //     fetchTables();
    // }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            const eventsData: Event[] = await getEvents();
            
            const e = eventsData.find(e => e.name === table?.event);
            
            setEvent(e);
        };
        fetchEvents();
    }, [menus, table]); 
    

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const menuItemsData = await getMenuItems();
                setMenuItems(menuItemsData);
            } catch (error) {
                console.error("Error fetching menu items:", error);
            }
        };
        fetchMenuItems();
    }, []);

    const navigate = useNavigate();
    const {table: tableNumber} = useParams<{ table: string }>();

    useEffect(() => {
        if (!checkTableNumber(tableNumber)) navigate(privateRoutes.home);
    }, [navigate, tableNumber]);

    const getTable = (tableNumber: number): Table | undefined => {
        const table = tables.find(table => table.table === tableNumber);
        // console.assert(!!table, `No table found for table number: ${tableNumber}`);
        return table;
    };
    
    const getNbReadyTables = () => tables.filter(table => table.status === TableStatusEnum.ORDER_READY).length;
    
    const extractedMenu: Menu = menuItems.reduce((acc, item) => {
        acc[item.category].push(item);
        return acc;
    }, {
        [MenuCategoryEnum.BEVERAGE]: [],
        [MenuCategoryEnum.STARTER]: [],
        [MenuCategoryEnum.MAIN]: [],
        [MenuCategoryEnum.DESSERT]: []
    } as Menu);

    const extractEvent = (eventName: string): Event => {
        const event = events.find(event => event.name === eventName);
        return event!;
    };

    const [order, setOrder] = useState<Order>({
        table: table?.table,
        event: event?.name,
        total: 0
    });

    const getItem = (id: string, isEventMenu: boolean): MenuItem | MenuEvent | undefined => {
        if (isEventMenu) return event?.menus.find(menu => menu.id === id);
        if (event) return event?.beverages.find(item => item.id === id);
        return menuItems.find(item => item.id === id);
    };

    const getNewQuantity = (id: string, delta: number, isEventMenu: boolean): number => {
        const items = isEventMenu ? order.itemsEvent : order.items;
        if (!items || !items[id]) return delta;
        else return items[id] + delta;
    };

    const changeItemQuantity = (id: string, delta: number, isEventMenu: boolean = false) => {
        // Find the item in the menu
        const item = getItem(id, isEventMenu);
        console.log(item);
        if (!item) {
            console.warn(`Cannot find item with id: ${id}`);
            return;
        }

        // Update the quantity
        const newQuantity = getNewQuantity(id, delta, isEventMenu);
        if (newQuantity < 0) {
            console.warn(`Cannot have negative quantity: ${item.fullName} = ${newQuantity}`);
            return;
        }

        // Update the order
        const newOrder = {...order, total: order.total + item.price * delta};
        if (isEventMenu) newOrder.itemsEvent = {...order.itemsEvent, [id]: newQuantity};
        else newOrder.items = {...order.items, [id]: newQuantity};
        setOrder(newOrder);
    };

    const cancelOrder = () => {
        navigate(privateRoutes.home);
    };

    const confirmOrder = async () => {
        
        const newOrder = {
            ...order,
            event: event?.id,
            datetime: new Date()
        };
        newOrder.table = parseFloat(tableNumber!);
        
        const o: Order = await createOrder(newOrder);
        setOrder(o);

        const tableString = localStorage.getItem("table");
        const parsedString = JSON.parse(tableString!);
        const localTable: Table = {
            table: parsedString.table,
            nbPeople: parsedString.nbPeople,
            status: TableStatusEnum.ORDER_IN_PROGRESS,
            event: parsedString.event
        };
        if (table) {
        const orderProgress: MenuBackendNoId = {
            fullName: "_|" + table.table + "|" + table.nbPeople + "|" + table.event + "|" + TableStatusEnum.ORDER_IN_PROGRESS,
            shortName: menus.length + "|" + table.table + "|" + table.nbPeople + "|" + table.event + "|" + TableStatusEnum.ORDER_IN_PROGRESS,
            price: 1,
            category: "DESSERT",
            image: "https://cdn.pixabay.com/photo/2016/11/12/15/28/restaurant-1819024_960_720.jpg"
        }

        addMenu(orderProgress);

        navigate(privateRoutes.home);

        setTimeout(async () => {
            localTable.status = TableStatusEnum.ORDER_READY;

            const orderDone: MenuBackendNoId = {
                fullName: "_|" + table?.table + "|" + table?.nbPeople + "|" + table?.event + "|" + TableStatusEnum.ORDER_READY,
                shortName: menus.length+1 + "|" + table.table + "|" + table?.nbPeople + "|" + table?.event + "|" + TableStatusEnum.ORDER_READY,
                price: 1,
                category: "DESSERT",
                image: "https://cdn.pixabay.com/photo/2016/11/12/15/28/restaurant-1819024_960_720.jpg"
            }
            addMenu(orderDone);
            setTables(await getTables());

            setPopup(`La commande effectuée pour la table ${newOrder.table} est prête.`);
        }, 5000);
        }
    };

    const card: React.ReactNode = (
        <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} height={"100%"}>
            <ActionCardGeneric
                title={`Table ${parseFloat(tableNumber!)}`}
                leftTitle={table?.event}
                rightTitle={`${order.total} €`}
                mainContent={
                    event
                        ? <MenuEventList
                            event={event}
                            order={order}
                            changeItemQuantity={changeItemQuantity}
                        />
                        : <MenuList
                            menu={extractedMenu}
                            orderItems={order.items ?? {}}
                            changeItemQuantity={changeItemQuantity}
                        />
                }
                buttons={<>
                    <Button onClick={cancelOrder} variant={"contained"} color={"error"} sx={{width: "200px"}}>
                        Annuler
                    </Button>
                    <Button onClick={confirmOrder} disabled={!order.items && !order.itemsEvent}
                            variant={"contained"} sx={{width: "200px"}}>
                        Confirmer
                    </Button>
                </>}
                minWidth={"95%"}
                minHeight={"95%"}
            />
        </Box>
    );

    return <BackNavPageGeneric title={"Commande"} readyTables={getNbReadyTables()} children={card}/>;
}