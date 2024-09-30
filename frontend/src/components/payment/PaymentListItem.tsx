import {Divider, ListItem, ListItemIcon, Stack, Typography} from "@mui/material";
import React from "react";
import QuantityButtonsGeneric from "../generics/QuantityButtonsGeneric.tsx";

interface PaymentListItemProps {
    name: string;
    remaining: number;
    quantity: number;
    changeQuantity: (delta: number) => void;
    icon?: React.ReactElement;
}

export default function PaymentListItem({
    name, remaining, quantity, changeQuantity, icon
}: Readonly<PaymentListItemProps>) {
    return (<>
        <ListItem>
            <Stack direction={"row"} alignItems={"center"} spacing={2} width={"100%"}>
                <ListItemIcon>{icon}</ListItemIcon>
                <Typography flex={3.5}>{name}</Typography>
                <Typography flex={1}>Restant : {remaining}</Typography>
                <Typography flex={0.5} align={"right"}>{quantity}</Typography>
                <QuantityButtonsGeneric
                    removeOne={() => changeQuantity(-1)}
                    removeDisabled={quantity < 1}
                    addOne={() => changeQuantity(1)}
                    addDisabled={remaining < 1}
                    hideEdgeEnd
                />
            </Stack>
        </ListItem>
        <Divider component={"li"}/>
    </>);
}