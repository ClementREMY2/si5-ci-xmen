import {ExpandLess, ExpandMore} from "@mui/icons-material";
import {ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import React, {useMemo} from "react";
import {MenuItem} from "../../interfaces/Menu.ts";
import {Order} from "../../interfaces/Order.ts";
import MenuSubList from "./MenuSubList.tsx";

interface MenuListItemProps {
    title: string;
    icon?: React.ReactElement;
    items: MenuItem[];
    order: Order;
    changeItemQuantity: (id: string, delta: number) => void;
    open: boolean;
    handleOpen: () => void;
}

export default function MenuListItem({
    title,
    icon,
    items,
    order,
    changeItemQuantity,
    open,
    handleOpen
}: Readonly<MenuListItemProps>) {
    const hasItems = useMemo(() => items.length > 0, [items]);

    return (<>
        <ListItemButton onClick={handleOpen}>
            {icon && <ListItemIcon>{icon}</ListItemIcon>}
            <ListItemText primary={title}/>
            {hasItems && (open ? <ExpandLess/> : <ExpandMore/>)}
        </ListItemButton>
        {hasItems && <MenuSubList items={items} order={order} changeItemQuantity={changeItemQuantity} open={open}/>}
    </>);
}