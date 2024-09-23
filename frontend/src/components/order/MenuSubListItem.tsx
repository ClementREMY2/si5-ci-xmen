import {AddCircle, RemoveCircle} from "@mui/icons-material";
import {Box, IconButton, Stack, Typography} from "@mui/material";
import {MenuItem} from "../../interfaces/Menu.ts";

interface MenuSubListItemProps {
    item: MenuItem;
    quantity: number;
    addOne: () => void;
    removeOne: () => void;
}

export default function MenuSubListItem({item, quantity, addOne, removeOne}: Readonly<MenuSubListItemProps>) {
    return (
        <Box paddingX={2} paddingY={1} sx={{border: "1px solid", borderRadius: 2}}>
            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Typography variant={"h6"}>{item.fullName}</Typography>
                <Typography variant={"subtitle1"}>{item.price} €</Typography>
            </Stack>
            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Typography>Quantity: {quantity}</Typography>
                <Stack direction={"row"}>
                    <IconButton onClick={removeOne} disabled={quantity < 1}>
                        <RemoveCircle/>
                    </IconButton>
                    <IconButton edge={"end"} onClick={addOne}>
                        <AddCircle/>
                    </IconButton>
                </Stack>
            </Stack>
        </Box>
    );
}