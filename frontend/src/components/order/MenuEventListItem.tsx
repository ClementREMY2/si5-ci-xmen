import {ExpandLess, ExpandMore} from "@mui/icons-material";
import {ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import React, {useMemo} from "react";
import {MenuEvent} from "../../interfaces/Menu.ts";
import {OrderItems} from "../../interfaces/Order.ts";
import MenuEventSubList from "./MenuEventSubList.tsx";

interface MenuEventListItemProps {
    title: string;
    icon?: React.ReactElement;
    menuItems: MenuEvent[];
    orderItems: OrderItems;
    changeEventItemQuantity: (id: string, delta: number) => void;
    open: boolean;
    handleOpen: () => void;
}

export default function MenuEventListItem({
    title,
    icon,
    menuItems,
    orderItems,
    changeEventItemQuantity,
    open,
    handleOpen
}: Readonly<MenuEventListItemProps>) {
    const hasItems = useMemo(() => menuItems.length > 0, [menuItems]);

    return (<>
        <ListItemButton onClick={handleOpen}>
            {icon && <ListItemIcon>{icon}</ListItemIcon>}
            <ListItemText primary={title}/>
            {hasItems && (open ? <ExpandLess/> : <ExpandMore/>)}
        </ListItemButton>
        {hasItems &&
            <MenuEventSubList menuItems={menuItems} orderItems={orderItems}
                              changeEventItemQuantity={changeEventItemQuantity} open={open}/>}
    </>);
}