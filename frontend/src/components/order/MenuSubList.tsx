import {Collapse, Grid2} from "@mui/material";
import {MenuItem} from "../../interfaces/Menu.ts";
import MenuSubListItem from "./MenuSubListItem.tsx";

interface MenuSubListProps {
    items: MenuItem[];
    open: boolean;
}

export default function MenuSubList({items, open}: Readonly<MenuSubListProps>) {
    return (
        <Collapse in={open} timeout={"auto"} unmountOnExit>
            <Grid2 container spacing={2}>
                {items.map(item => (
                    <Grid2 key={item.id} size={6}><MenuSubListItem item={item}/></Grid2>
                ))}
            </Grid2>
        </Collapse>
    );
}