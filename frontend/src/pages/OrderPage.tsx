import {Box, Button} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import ActionCardGeneric from "../components/generics/ActionCardGeneric.tsx";
import BackNavPageGeneric from "../components/generics/BackNavPageGeneric.tsx";
import MenuEventList from "../components/order/MenuEventList.tsx";
import MenuList from "../components/order/MenuList.tsx";
import {Event} from "../interfaces/Event.ts";
import {Menu, MenuBackend, MenuCategoryEnum, MenuEvent, MenuItem} from "../interfaces/Menu.ts";
import {Order} from "../interfaces/Order.ts";
import {Table, TableStatusEnum} from "../interfaces/Table.ts";
import {checkTableNumber} from "../utils/PageUtils.ts";
import {privateRoutes} from "../utils/Routes.ts";
import { getTables } from "../formatter/TableFormatter.ts";
import { getAllEvents } from "../formatter/EventFormatter.ts";
import { getAllMenuItem } from "../formatter/MenuFormatter.ts";
import { getMenusGateway } from "../services/MenuService.ts";

export default function OrderPage() {
    const [tables, setTables] = useState<Table[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [menus, setMenus] = useState<MenuBackend[]>([]);

    useEffect(() => {
        const fetchMenus = async () => {
            const menusData = await getMenusGateway();
            setMenus(menusData);
        };
        fetchMenus();
    }, []);

    useEffect(() => {
        const fetchTables = async () => {
            const tablesData = await getTables();
            console.log(tablesData);
            setTables(tablesData);
        };
        fetchTables();
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            const eventsData = getAllEvents(menus);
            setEvents(eventsData);
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        const fetchMenus = async () => {
            const menusItems: MenuItem[] = await getAllMenuItem(menus);
            setMenuItems(menusItems);
        };
        fetchMenus();
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

    const table = getTable(parseFloat(tableNumber!));
    console.log("table" + table?.event + " " + table?.table + " " + table?.status + " " + table?.nbPeople);   
    const event = table?.event ? extractEvent(table.event) : undefined;

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

    const confirmOrder = () => {
        const newOrder = {
            ...order,
            date: new Date()
        };
        // Send the order to the server
        setOrder(newOrder);
        console.log(newOrder);
        navigate(privateRoutes.home);
    };

    const card: React.ReactNode = (
        <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} height={"100%"}>
            <ActionCardGeneric
                title={`Table ${order.table}`}
                leftTitle={table?.event}
                rightTitle={`${order.total} €`}
                mainContent={
                    table?.event
                        ? <MenuEventList
                            event={extractEvent(table.event)}
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