import {LocalBar, Star} from "@mui/icons-material";
import {List} from "@mui/material";
import {useState} from "react";
import {Event} from "../../interfaces/Event.ts";
import {MenuCategoryEnum} from "../../interfaces/Menu.ts";
import {Order} from "../../interfaces/Order.ts";
import MenuEventListItem from "./MenuEventListItem.tsx";
import MenuListItem from "./MenuListItem.tsx";

interface MenuEventListProps {
    event: Event;
    order: Order;
    changeItemQuantity: (id: string, delta: number, isEventMenu?: boolean) => void;
}

export default function MenuEventList({event, order, changeItemQuantity}: Readonly<MenuEventListProps>) {
    const [open, setOpen] = useState<{[key: string]: boolean}>({
        ["beverages"]: true,
        ["menus"]: true
    });

    const handleOpen = (category: string) => {
        setOpen(prevState => ({...prevState, [category]: !prevState[category]}));
    };

    const beverages = event?.beverages || []; // Valeur par défaut : tableau vide
    const menus = event?.menus || []; // Valeur par défaut : tableau vide

    return (
        <List sx={{width: "100%"}}>
            <MenuListItem
                title={MenuCategoryEnum.BEVERAGE.toUpperCase()}
                icon={<LocalBar color={"primary"}/>}
                menuItems={beverages}
                orderItems={order.items ?? {}}
                changeItemQuantity={changeItemQuantity}
                open={open["beverages"]}
                handleOpen={() => handleOpen("beverages")}
            />
            <MenuEventListItem
                title={"MENU"}
                icon={<Star color={"primary"}/>}
                menuItems={menus}
                orderItems={order.itemsEvent ?? {}}
                changeEventItemQuantity={(id, delta) => changeItemQuantity(id, delta, true)}
                open={open["menus"]}
                handleOpen={() => handleOpen("menus")}
            />
        </List>
    );
}