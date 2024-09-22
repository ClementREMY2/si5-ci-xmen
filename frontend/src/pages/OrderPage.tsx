import {Box, Button} from "@mui/material";
import React, {useState} from "react";
import ActionCardGeneric from "../components/generics/ActionCardGeneric.tsx";
import BackNavPageGeneric from "../components/generics/BackNavPageGeneric.tsx";
import MenuList from "../components/order/MenuList.tsx";
import {Order, OrderStatus} from "../interfaces/Order.ts";
import {menuNormal} from "../mocks/Menu.ts";

export default function OrderPage() {
    const [order, setOrder] = useState<Order>({
        table: 108,
        status: OrderStatus.OPEN,
        total: 0,
        items: {}
    });

    const changeItemQuantity = (id: string, delta: number) => {
        // Find the item in the menu
        const item = menuNormal.find(item => item.id === id);
        if (!item) {
            console.warn(`Cannot find item with id: ${id}`);
            return;
        }


        // Update the quantity
        let newQuantity: number;
        if (!order.items[id]) {
            newQuantity = delta;
        } else {
            newQuantity = order.items[id] + delta;
        }

        if (newQuantity < 0) {
            console.warn(`Cannot have negative quantity: ${item.fullName} = ${newQuantity}`);
            return;
        }

        // Update the order
        setOrder(prevState => ({
            ...prevState,
            total: prevState.total + item.price * delta,
            items: {
                ...prevState.items,
                [id]: newQuantity
            }
        }));
    };

    const card: React.ReactNode = (
        <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} height={"100%"}>
            <ActionCardGeneric
                title={`Table ${order.table}`}
                leftTitle={"Avisto"}
                rightTitle={`${order.total} €`}
                mainContent={<MenuList menu={menuNormal} order={order} changeItemQuantity={changeItemQuantity}/>}
                buttons={[<Button variant={"contained"} sx={{width: "200px"}}>Order</Button>]}
                minWidth={"95%"}
                minHeight={"95%"}
            />
        </Box>
    );

    return <BackNavPageGeneric title={"Order"} readyTables={2} children={card}/>;
}