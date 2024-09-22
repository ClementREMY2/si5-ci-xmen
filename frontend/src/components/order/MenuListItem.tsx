import {ExpandLess, ExpandMore} from "@mui/icons-material";
import {Collapse, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import React, {useMemo} from "react";
import {MenuItem} from "../../interfaces/Menu.ts";

interface MenuListItemProps {
    title: string;
    icon?: React.ReactElement;
    open: boolean;
    handleOpen: () => void;
    items: MenuItem[];
}

export default function MenuListItem({title, icon, open, handleOpen, items}: Readonly<MenuListItemProps>) {
    const hasItems = useMemo(() => items.length > 0, [items]);

    return (<>
        <ListItemButton onClick={handleOpen}>
            {icon && <ListItemIcon>{icon}</ListItemIcon>}
            <ListItemText primary={title}/>
            {hasItems && (open ? <ExpandLess/> : <ExpandMore/>)}
        </ListItemButton>
        {hasItems &&
            <Collapse in={open} timeout={"auto"} unmountOnExit>
                {items.map(item => (
                    <p>{item.fullName}</p>
                ))}
            </Collapse>
        }
    </>);
}