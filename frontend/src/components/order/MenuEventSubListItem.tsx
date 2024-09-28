import {AddCircle, RemoveCircle} from "@mui/icons-material";
import {Box, IconButton, Stack, Typography} from "@mui/material";
import {MenuCategoryEnum, MenuEvent} from "../../interfaces/Menu.ts";

interface MenuEventSubListItemProps {
    item: MenuEvent;
    quantity: number;
    addOne: () => void;
    removeOne: () => void;
}

export default function MenuEventSubListItem({item, quantity, addOne, removeOne}: Readonly<MenuEventSubListItemProps>) {
    return (
        <Box paddingX={2} paddingY={1} sx={{border: "1px solid", borderRadius: 2}}>
            <Stack direction={"row"} alignItems={"center"}>
                <Typography flex={1.05} variant={"h6"}>{item.fullName}</Typography>
                <Stack flex={0.95} direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography>Quantity: {quantity}</Typography>
                    <Stack direction={"row"}>
                        <IconButton onClick={removeOne} color={"primary"} disabled={quantity < 1}>
                            <RemoveCircle/>
                        </IconButton>
                        <IconButton edge={"end"} color={"primary"} onClick={addOne}>
                            <AddCircle/>
                        </IconButton>
                    </Stack>
                </Stack>
            </Stack>
            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Typography>
                    {`${item.menu[MenuCategoryEnum.STARTER].fullName}, ${item.menu[MenuCategoryEnum.MAIN].fullName}, ${item.menu[MenuCategoryEnum.DESSERT].fullName}`}
                </Typography>
                <Typography variant={"subtitle1"}>{item.price} €</Typography>
            </Stack>
        </Box>
    );
}