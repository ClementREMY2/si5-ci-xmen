import {Collapse, Grid2} from "@mui/material";
import {MenuItem} from "../../interfaces/Menu.ts";
import {OrderItems} from "../../interfaces/Order.ts";
import MenuSubListItem from "./MenuSubListItem.tsx";

interface MenuSubListProps {
    menuItems: MenuItem[];
    orderItems: OrderItems;
    changeItemQuantity: (id: string, delta: number) => void;
    open: boolean;
}

export default function MenuSubList({menuItems, orderItems, changeItemQuantity, open}: Readonly<MenuSubListProps>) {
    return (
        <Collapse in={open} timeout={"auto"} unmountOnExit>
            <Grid2 container spacing={2}>
                {menuItems.map(item => (
                    <Grid2 key={item.id} size={6}>
                        <MenuSubListItem
                            item={item}
                            quantity={orderItems[item.id] ?? 0}
                            addOne={() => changeItemQuantity(item.id, 1)}
                            removeOne={() => changeItemQuantity(item.id, -1)}
                        />
                    </Grid2>
                ))}
            </Grid2>
        </Collapse>
    );
}