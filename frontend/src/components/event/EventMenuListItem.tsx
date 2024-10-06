import {Cancel, Done} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {Box, Grid2, IconButton, ListItem, MenuItem as SelectItem, Stack, TextField, Typography} from "@mui/material";
import {MenuCategoryEnum, MenuEvent, MenuItem} from "../../interfaces/Menu.ts";
import {menuNormalMock} from "../../mocks/Menu.ts";

interface EventMenuListItemProps {
    menu: MenuEvent;
    editEvent?: boolean;
    editMenu?: boolean;
    canAskMenuEdit?: boolean;
    changeEditedMenu?: (menu: MenuEvent) => void;
    askMenuEdit?: () => void;
    saveMenuEdit?: (cancel?: boolean) => void;
    deleteMenu?: () => void;
}

const getMenuItem = (itemId: string): MenuItem | undefined => {
    return menuNormalMock.find(item => item.id === itemId);
}

export default function EventMenuListItem({
    menu,
    editEvent,
    editMenu,
    canAskMenuEdit,
    changeEditedMenu = () => {},
    askMenuEdit = () => {},
    saveMenuEdit = () => {},
    deleteMenu = () => {},
}: Readonly<EventMenuListItemProps>) {
    const realPrice = Object.values(menu.menu).reduce((total, item) => total + item.price, 0);

    const changeFullName = (fullName: string) => changeEditedMenu({...menu, fullName});

    // const changeShortName = (shortName: string) => changeEditedMenu({...menu, shortName});

    const changePrice = (price: number = 0) => changeEditedMenu({...menu, price});

    const changeMenuItem = (category: string, itemId: string) => {
        const item = getMenuItem(itemId);
        if (item) changeEditedMenu({...menu, menu: {...menu.menu, [category]: item}});
    }

    const editMenuContent = () => (<>
        <Grid2 container spacing={1}>
            <Grid2 size={4}>
                <TextField label={"Nom complet"} value={menu.fullName} size={"small"} margin={"dense"} fullWidth
                           onChange={(event) => changeFullName(event.target.value)}/>
            </Grid2>
            {/*
            <Grid2 size={4}>
                <TextField label={"Nom court"} value={menu.shortName} size={"small"} margin={"dense"} fullWidth
                           onChange={(event) => changeShortName(event.target.value)}/>
            </Grid2>
            */}
            <Grid2 size={4}></Grid2>
            <Grid2 size={4}></Grid2>
            <Grid2 size={4}>
                <TextField label={MenuCategoryEnum.STARTER}
                           value={menu.menu[MenuCategoryEnum.STARTER]?.id}
                           select size={"small"} margin={"dense"} fullWidth
                           onChange={(event) => changeMenuItem(MenuCategoryEnum.STARTER, event.target.value)}>
                    {menuNormalMock.filter(i => i.category === MenuCategoryEnum.STARTER).map(menuItem => (
                        <SelectItem key={menuItem.id} value={menuItem.id}>
                            {menuItem.fullName}
                        </SelectItem>
                    ))}
                </TextField>
            </Grid2>
            <Grid2 size={4}>
                <TextField label={MenuCategoryEnum.MAIN}
                           value={menu.menu[MenuCategoryEnum.MAIN]?.id}
                           select size={"small"} margin={"dense"} fullWidth
                           onChange={(event) => changeMenuItem(MenuCategoryEnum.MAIN, event.target.value)}>
                    {menuNormalMock.filter(i => i.category === MenuCategoryEnum.MAIN).map(menuItem => (
                        <SelectItem key={menuItem.id} value={menuItem.id}>
                            {menuItem.fullName}
                        </SelectItem>
                    ))}
                </TextField>
            </Grid2>
            <Grid2 size={4}>
                <TextField label={MenuCategoryEnum.DESSERT}
                           value={menu.menu[MenuCategoryEnum.DESSERT]?.id}
                           select size={"small"} margin={"dense"} fullWidth
                           onChange={(event) => changeMenuItem(MenuCategoryEnum.DESSERT, event.target.value)}>
                    {menuNormalMock.filter(i => i.category === MenuCategoryEnum.DESSERT).map(menuItem => (
                        <SelectItem key={menuItem.id} value={menuItem.id}>
                            {menuItem.fullName}
                        </SelectItem>
                    ))}
                </TextField>
            </Grid2>
            <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <Typography marginLeft={2}>Prix réel : {realPrice} €</Typography>
            </Grid2>
            <Grid2 size={4}>
                <TextField label={"Prix affiché"} value={menu.price} type={"number"}
                           size={"small"} margin={"dense"} fullWidth slotProps={{htmlInput: {min: 0}}}
                           onChange={(event) => changePrice(parseFloat(event.target.value))}/>
            </Grid2>
        </Grid2>
    </>);

    const staticMenuContent = () => (<>
        <Typography variant={"h6"} paddingBottom={1}>{menu.fullName === "" ? "Nouveau menu" : menu.fullName}</Typography>
        <Grid2 container spacing={1}>
            <Grid2 size={4}>
                <Typography>{MenuCategoryEnum.STARTER} : {menu.menu[MenuCategoryEnum.STARTER]?.fullName}</Typography>
            </Grid2>
            <Grid2 size={4}>
                <Typography>{MenuCategoryEnum.MAIN} : {menu.menu[MenuCategoryEnum.MAIN]?.fullName}</Typography>
            </Grid2>
            <Grid2 size={4}>
                <Typography>{MenuCategoryEnum.DESSERT} : {menu.menu[MenuCategoryEnum.DESSERT]?.fullName}</Typography>
            </Grid2>
            <Grid2 size={4}>
                <Typography>Prix réel : {realPrice} €</Typography>
            </Grid2>
            <Grid2 size={4}>
                <Typography>Prix affiché : {menu.price} €</Typography>
            </Grid2>
        </Grid2>
    </>);

    const editActionsContent = () => (<>
        <IconButton color={"success"} onClick={() => saveMenuEdit()}>
            <Done/>
        </IconButton>
        <IconButton color={"error"} onClick={() => saveMenuEdit(true)}>
            <Cancel/>
        </IconButton>
    </>);

    const staticActionsContent = () => (<>
        <IconButton color={"primary"} onClick={askMenuEdit} disabled={!canAskMenuEdit}>
            <EditIcon/>
        </IconButton>
        <IconButton color={"error"} onClick={deleteMenu} disabled={!canAskMenuEdit}>
            <DeleteIcon/>
        </IconButton>
    </>);

    return (
        <ListItem key={menu.id} disableGutters>
            <Stack direction={"row"} alignItems={"center"} width={"100%"}>
                <Box paddingX={2} paddingY={1} width={"100%"} sx={{border: "1px solid", borderRadius: 2}}>
                    {editEvent && editMenu
                        ? editMenuContent()
                        : staticMenuContent()
                    }
                </Box>
                {editEvent &&
                    <Stack spacing={1}>
                        {editMenu
                            ? editActionsContent()
                            : staticActionsContent()
                        }
                    </Stack>
                }
            </Stack>
        </ListItem>
    );
}