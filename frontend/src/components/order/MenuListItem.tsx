import {ExpandLess, ExpandMore} from "@mui/icons-material";
import {ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import React, {useMemo} from "react";
import {MenuItem} from "../../interfaces/Menu.ts";
import {OrderItems} from "../../interfaces/Order.ts";
import MenuSubList from "./MenuSubList.tsx";

interface MenuListItemProps {
    title: string;
    icon?: React.ReactElement;
    menuItems: MenuItem[];
    orderItems: OrderItems;
    changeItemQuantity: (id: string, delta: number) => void;
    open: boolean;
    handleOpen: () => void;
}

export default function MenuListItem({
    title,
    icon,
    menuItems,
    orderItems,
    changeItemQuantity,
    open,
    handleOpen
}: Readonly<MenuListItemProps>) {
    const hasItems = useMemo(() => menuItems.length > 0, [menuItems]);

    return (<>
        <ListItemButton onClick={handleOpen}>
            {icon && <ListItemIcon>{icon}</ListItemIcon>}
            <ListItemText primary={title}/>
            {hasItems && (open ? <ExpandLess/> : <ExpandMore/>)}
        </ListItemButton>
        {hasItems &&
            <MenuSubList menuItems={menuItems} orderItems={orderItems} changeItemQuantity={changeItemQuantity}
                         open={open}/>}
    </>);
}