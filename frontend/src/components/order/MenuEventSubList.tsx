import {Collapse, Stack} from "@mui/material";
import {MenuEvent} from "../../interfaces/Menu.ts";
import {OrderItems} from "../../interfaces/Order.ts";
import MenuEventSubListItem from "./MenuEventSubListItem.tsx";

interface MenuEventSubListProps {
    menuItems: MenuEvent[];
    orderItems: OrderItems;
    changeEventItemQuantity: (id: string, delta: number) => void;
    open: boolean;
}

export default function MenuEventSubList({
    menuItems, orderItems, changeEventItemQuantity, open
}: Readonly<MenuEventSubListProps>) {
    return (
        <Collapse in={open} timeout={"auto"} unmountOnExit>
            <Stack spacing={2}>
                {menuItems.map(item => (
                    <MenuEventSubListItem
                        key={item.id}
                        item={item}
                        quantity={orderItems[item.id] ?? 0}
                        addOne={() => changeEventItemQuantity(item.id, 1)}
                        removeOne={() => changeEventItemQuantity(item.id, -1)}
                    />
                ))}
            </Stack>
        </Collapse>
    );
}