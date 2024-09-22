import {Collapse, Grid2} from "@mui/material";
import {MenuItem} from "../../interfaces/Menu.ts";
import {Order} from "../../interfaces/Order.ts";
import MenuSubListItem from "./MenuSubListItem.tsx";

interface MenuSubListProps {
    items: MenuItem[];
    order: Order;
    changeItemQuantity: (id: string, delta: number) => void;
    open: boolean;
}

export default function MenuSubList({items, order, changeItemQuantity, open}: Readonly<MenuSubListProps>) {
    return (
        <Collapse in={open} timeout={"auto"} unmountOnExit>
            <Grid2 container spacing={2}>
                {items.map(item => (
                    <Grid2 key={item.id} size={6}>
                        <MenuSubListItem
                            item={item}
                            quantity={order.items[item.id] ?? 0}
                            addOne={() => changeItemQuantity(item.id, 1)}
                            removeOne={() => changeItemQuantity(item.id, -1)}
                        />
                    </Grid2>
                ))}
            </Grid2>
        </Collapse>
    );
}