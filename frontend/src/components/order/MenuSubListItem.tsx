import {AddCircle, RemoveCircle} from "@mui/icons-material";
import {Box, IconButton, Stack, Typography} from "@mui/material";
import {MenuItem} from "../../interfaces/Menu.ts";

interface MenuSubListItemProps {
    item: MenuItem;
}

export default function MenuSubListItem({item}: Readonly<MenuSubListItemProps>) {
    return (
        <Box paddingX={2} paddingY={1} sx={{border: "1px solid", borderRadius: 2}}>
            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Typography variant={"h6"}>{item.fullName}</Typography>
                <Typography variant={"subtitle1"}>{item.price} €</Typography>
            </Stack>
            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Typography>Quantity: 0</Typography>
                <Stack direction={"row"}>
                    <IconButton><RemoveCircle/></IconButton>
                    <IconButton edge={"end"}><AddCircle/></IconButton>
                </Stack>
            </Stack>
        </Box>
    );
}