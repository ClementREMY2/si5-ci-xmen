import {Box, Button} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import ActionCardGeneric from "../components/generics/ActionCardGeneric.tsx";
import BackNavPageGeneric from "../components/generics/BackNavPageGeneric.tsx";
import PaymentList from "../components/payment/PaymentList.tsx";
import {Event} from "../interfaces/Event.ts";
import {MenuEvent, MenuItem} from "../interfaces/Menu.ts";
import {Order} from "../interfaces/Order.ts";
import {Table, TableStatusEnum} from "../interfaces/Table.ts";
import {eventsMock} from "../mocks/Event.ts";
import {menuNormalMock} from "../mocks/Menu.ts";
import {eventOrderMock, tableOrderMock} from "../mocks/Order.ts";
import {tablesMock} from "../mocks/Tables.ts";
import {checkEventName, checkTableNumber} from "../utils/PageUtils.ts";
import {privateRoutes} from "../utils/Routes.ts";

const findTable = (tableNumber?: string): Table | undefined => {
    if (!checkTableNumber(tableNumber, false)) return undefined;
    return tablesMock.find(table => table.table === parseFloat(tableNumber!));
};

const findEvent = (eventName?: string): Event | undefined => {
    if (!checkEventName(eventName, false)) return undefined;
    return eventsMock.find(event => event.name === eventName);
};

const getNbReadyTables = () => tablesMock.filter(table => table.status === TableStatusEnum.ORDER_READY).length;

export default function PaymentPage() {
    const navigate = useNavigate();
    const {table: tableNumber, event: eventName} = useParams();

    const table = findTable(tableNumber);
    const event = findEvent(eventName);

    useEffect(() => {
        if (!table && !event) {
            console.warn("No table found for table number:", tableNumber, "and no event found for name:", eventName,
                "=> redirecting to home page");
            navigate(privateRoutes.home);
        } else if (table && event) {
            console.warn("Can't have table and event for payment, redirecting to home page");
            navigate(privateRoutes.home);
        }
    }, [navigate, tableNumber, table, eventName, event]);

    const order = table ? tableOrderMock : eventOrderMock;
    const [paying, setPaying] = useState<Order>({
        total: 0,
        items: {},
        itemsEvent: {}
    });
    const [paid, setPaid] = useState<Order>({
        total: 0,
        items: {},
        itemsEvent: {}
    });
    const [tip, setTip] = useState<number>(0);

    const getItem = (id: string, isEventMenu: boolean): MenuItem | MenuEvent | undefined => {
        if (isEventMenu) return event?.menus.find(menu => menu.id === id);
        if (event) return event?.beverages.find(item => item.id === id);
        return menuNormalMock.find(item => item.id === id);
    };

    const getNewQuantity = (id: string, delta: number, isEventMenu: boolean): number => {
        const items = isEventMenu ? paying.itemsEvent! : paying.items!;
        return (items[id] || 0) + delta;
    };

    const changePayingQuantity = (id: string, delta: number, isEventMenu: boolean = false) => {
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
        const newPaying = {...paying, total: paying.total + item.price * delta};
        if (isEventMenu) newPaying.itemsEvent = {...paying.itemsEvent, [id]: newQuantity};
        else newPaying.items = {...paying.items, [id]: newQuantity};
        setPaying(newPaying);
    };

    const addAllToPaying = (checked: boolean) => {
        if (!checked) {
            removeAllFromPaying();
            return;
        }

        const newPaying = {...order, total: order.total - paid.total};
        if (newPaying.items && paid.items) {
            Object.entries(paid.items).forEach(([id, quantity]) => {
                newPaying.items![id] -= quantity;
            });
        }
        if (newPaying.itemsEvent && paid.itemsEvent) {
            Object.entries(paid.itemsEvent).forEach(([id, quantity]) => {
                newPaying.itemsEvent![id] -= quantity;
            });
        }
        setPaying(newPaying);
    };

    const removeAllFromPaying = () => {
        setPaying({total: 0, items: {}, itemsEvent: {}});
    };

    const handlePayment = () => {
        const total = paid.total + paying.total;
        if (total === order.total) {
            setPaid({...order});
            toast.success("Paiement terminé!");
            navigate(privateRoutes.home);
        }

        const newPaid = {...paid, total};

        // Copy the items from paying to paid
        Object.entries(paying.items!).forEach(([id, quantity]) => {
            if (quantity > 0) {
                newPaid.items![id] = (newPaid.items![id] || 0) + quantity;
            }
        });
        Object.entries(paying.itemsEvent!).forEach(([id, quantity]) => {
            if (quantity > 0) {
                newPaid.itemsEvent![id] = (newPaid.itemsEvent![id] || 0) + quantity;
            }
        });

        setPaid(newPaid);
        removeAllFromPaying();
    };

    const card: React.ReactNode = (
        <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} height={"100%"}>
            <ActionCardGeneric
                title={order.table ? `Table ${order.table}` : `Événement ${order.event}`}
                rightTitle={`${paid.total} € / ${order.total} €`}
                mainContent={<PaymentList order={order} paying={paying} changePayingQuantity={changePayingQuantity}
                                          addAllToPaying={addAllToPaying} paid={paid} tip={tip} changeTip={setTip}/>}
                buttons={
                    <Button onClick={handlePayment} variant={"contained"} sx={{width: "200px"}}>
                        Payer {paying.total + (isNaN(tip) ? 0 : tip)} €
                    </Button>
                }
                minWidth={"95%"}
                minHeight={"95%"}
            />
        </Box>
    );

    return <BackNavPageGeneric title={"Paiement"} readyTables={getNbReadyTables()} children={card}/>;
}