import {Cookie, LocalBar, Restaurant, Star, Tapas} from "@mui/icons-material";
import {Checkbox, Divider, List, Stack, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Event} from "../../interfaces/Event.ts";
import {MenuCategoryEnum} from "../../interfaces/Menu.ts";
import {Order} from "../../interfaces/Order.ts";
import {eventsMock} from "../../mocks/Event.ts";
import {menuNormalMock} from "../../mocks/Menu.ts";
import PaymentListItem from "./PaymentListItem.tsx";

interface PaymentListProps {
    order: Order;
    paying: Order;
    changePayingQuantity: (id: string, delta: number, isEventMenu?: boolean) => void;
    addAllToPaying: (checked: boolean) => void;
    paid: Order;
    tip: number;
    changeTip: (amount: number) => void;
}

export default function PaymentList({order, paying, changePayingQuantity, addAllToPaying, paid, tip, changeTip}: Readonly<PaymentListProps>) {
    const [payingAll, setPayingAll] = useState<boolean>(false);

    useEffect(() => {
        if (order.total - paid.total === paying.total) setPayingAll(true);
        else setPayingAll(false);
    }, [order.total, paid.total, paying.total]);
    
    const handlePayingAllChange = () => {
        addAllToPaying(!payingAll);
    }

    const getItemName = (id: string, isEvent: boolean): string => {
        const menu = isEvent ? eventsMock.find((event: Event) => event.name === order?.event)?.menus : menuNormalMock;
        return menu?.find(item => item.id === id)?.fullName || id;
    }

    const getIcon = (id: string): React.ReactElement | undefined => {
        const item = menuNormalMock.find(item => item.id === id);
        switch (item?.category) {
            case MenuCategoryEnum.BEVERAGE: return <LocalBar color={"primary"}/>;
            case MenuCategoryEnum.STARTER: return <Tapas color={"primary"}/>;
            case MenuCategoryEnum.MAIN: return <Restaurant color={"primary"}/>;
            case MenuCategoryEnum.DESSERT: return <Cookie color={"primary"}/>;
            default: return undefined;
        }
    }

    return (
        <Stack spacing={3} height={"100%"} paddingTop={2} overflow={"unset"}>
            <Stack direction={"row"} justifyContent={"end"} alignItems={"center"}>
                <Typography fontSize={"large"} fontWeight={"bold"}>Payer le total :</Typography>
                <Checkbox checked={payingAll} onClick={handlePayingAllChange}/>
            </Stack>
            <List sx={{height: "100%", overflowY: "auto"}}>
                {order.items && Object.entries(order.items).map(([id, quantity]) => (
                    <PaymentListItem
                        key={id}
                        name={getItemName(id, false)}
                        remaining={quantity - (paid.items![id] || 0) - (paying.items![id] || 0)}
                        quantity={paying.items![id] || 0}
                        changeQuantity={(delta: number) => changePayingQuantity(id, delta)}
                        icon={getIcon(id)}
                    />
                ))}
                <Divider component={"li"}/>
                {order.itemsEvent && Object.entries(order.itemsEvent).map(([id, quantity]) => (
                    <PaymentListItem
                        key={id}
                        name={getItemName(id, true)}
                        remaining={quantity - (paid.itemsEvent![id] || 0) - (paying.itemsEvent![id] || 0)}
                        quantity={paying.itemsEvent![id] || 0}
                        changeQuantity={(delta: number) => changePayingQuantity(id, delta, true)}
                        icon={<Star color={"primary"}/>}
                    />
                ))}
            </List>
            <Stack direction={"row"} justifyContent={"center"} alignItems={"center"}>
                <TextField label={"Pourboire"} type={"number"} value={tip} variant={"outlined"}
                           onChange={e => changeTip(parseFloat(e.target.value))}
                           margin={"normal"} slotProps={{htmlInput: {min: 0}}}/>
            </Stack>
        </Stack>
    );
}