import {Box, Button} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import ActionCardGeneric from "../components/generics/ActionCardGeneric.tsx";
import BackNavPageGeneric from "../components/generics/BackNavPageGeneric.tsx";
import MenuEventList from "../components/order/MenuEventList.tsx";
import MenuList from "../components/order/MenuList.tsx";
import {Event} from "../interfaces/Event.ts";
import {Menu, MenuCategoryEnum, MenuEvent, MenuItem} from "../interfaces/Menu.ts";
import {Order} from "../interfaces/Order.ts";
import {Table, TableStatusEnum} from "../interfaces/Table.ts";
import {eventsMock} from "../mocks/Event.ts";
import {menuNormalMock} from "../mocks/Menu.ts";
import {tablesMock} from "../mocks/Tables.ts";
import {checkTableNumber} from "../utils/PageUtils.ts";
import {privateRoutes} from "../utils/Routes.ts";

const getTable = (tableNumber: number): Table => {
    const table = tablesMock.find(table => table.table === tableNumber);
    console.assert(!!table, `No table found for table number: ${tableNumber}`);
    return table!;
};

const getNbReadyTables = () => tablesMock.filter(table => table.status === TableStatusEnum.ORDER_READY).length;

const extractedMenu: Menu = menuNormalMock.reduce((acc, item) => {
    acc[item.category].push(item);
    return acc;
}, {
    [MenuCategoryEnum.BEVERAGE]: [],
    [MenuCategoryEnum.STARTER]: [],
    [MenuCategoryEnum.MAIN]: [],
    [MenuCategoryEnum.DESSERT]: []
} as Menu);

const extractEvent = (eventName: string): Event => {
    const event = eventsMock.find(event => event.name === eventName);
    console.assert(!!event, `No event found for event name: ${eventName}`);
    return event!;
};

export default function OrderPage() {
    const navigate = useNavigate();
    const {table: tableNumber} = useParams();

    useEffect(() => {
        if (!checkTableNumber(tableNumber)) navigate(privateRoutes.home);
    }, [navigate, tableNumber]);

    const table = getTable(parseFloat(tableNumber!));
    const event = table.event ? extractEvent(table.event) : undefined;

    const [order, setOrder] = useState<Order>({
        table: table.table,
        event: event?.name,
        total: 0
    });

    const getItem = (id: string, isEventMenu: boolean = false): MenuItem | MenuEvent | undefined => {
        if (isEventMenu) return event?.menus.find(menu => menu.id === id);
        if (event) return event?.beverages.find(item => item.id === id);
        return menuNormalMock.find(item => item.id === id);
    };

    const getNewQuantity = (id: string, delta: number, isEventMenu: boolean = false): number => {
        const items = isEventMenu ? order.itemsEvent : order.items;
        if (!items || !items[id]) return delta;
        else return items![id] + delta;
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
        if (isEventMenu) order.itemsEvent = {...order.itemsEvent, [id]: newQuantity};
        else order.items = {...order.items, [id]: newQuantity};
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
                leftTitle={table.event}
                rightTitle={`${order.total} €`}
                mainContent={
                    table.event
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