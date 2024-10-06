import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {Box, IconButton, List, Stack, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {MenuEvent} from "../../interfaces/Menu.ts";
import {emptyMenuEvent} from "../../mocks/Menu.ts";
import EventMenuListItem from "./EventMenuListItem.tsx";

interface EventMenuListProps {
    menus: MenuEvent[];
    editEvent?: boolean;
    changeMenus?: (menus: MenuEvent[]) => void;
    changeIsMenuEditing?: (value: boolean) => void;
}

export default function EventMenuList({
    menus,
    editEvent,
    changeMenus = () => {},
    changeIsMenuEditing = () => {}
}: Readonly<EventMenuListProps>) {
    const [menuEdit, setMenuEdit] = useState<string>("");
    const [editedMenus, setEditedMenus] = useState<MenuEvent[]>(menus);

    useEffect(() => {
        if (!editEvent) setMenuEdit("");
    }, [editEvent]);

    useEffect(() => {
        changeIsMenuEditing(menuEdit !== "");
    }, [changeIsMenuEditing, menuEdit]);

    const askMenuEdit = (menuId: string) => {
        if (menuEdit === "") setMenuEdit(menuId);
    };

    const createNewMenu = () => {
        const newMenu = emptyMenuEvent;
        newMenu.id = `new-${Date.now()}`;
        setEditedMenus([...editedMenus, newMenu]);
        toast.success("Menu créé avec succès.");
    };

    const changeEditedMenu = (menuId: string, menu: MenuEvent = emptyMenuEvent) => {
        if (menuEdit === menuId) {
            const index = editedMenus.findIndex(m => m.id === menuId);
            if (index >= 0) {
                setEditedMenus([...editedMenus.slice(0, index), menu, ...editedMenus.slice(index + 1)]);
            } else {
                setEditedMenus([...editedMenus, menu]);
            }
        }
    };

    const saveMenuEdit = (menuId: string, cancel: boolean = false) => {
        if (menuEdit === menuId) {
            const indexEdited = editedMenus.findIndex(m => m.id === menuId);
            const indexInitial = menus.findIndex(m => m.id === menuId);

            if (indexEdited >= 0) {
                if (cancel) {
                    const canceledMenus = [...editedMenus];
                    if (indexInitial >= 0) canceledMenus[indexEdited] = menus[indexInitial]; // cancel edited menu
                    else canceledMenus.splice(indexEdited, 1); // remove new menu
                    setEditedMenus([...canceledMenus]);
                } else {
                    const initialEditedMenus = [...menus];
                    if (indexInitial >= 0) initialEditedMenus[indexInitial] = editedMenus[indexEdited]; // save edited menu
                    else initialEditedMenus.push(editedMenus[indexEdited]); // add new menu
                    changeMenus([...initialEditedMenus]);
                    toast.success("Menu modifié avec succès.");
                }
            }
            setMenuEdit("");
        }
    };

    const deleteMenu = (menuId: string) => {
        if (editEvent) {
            const indexEdited = editedMenus.findIndex(m => m.id === menuId);
            const indexInitial = menus.findIndex(m => m.id === menuId);

            if (indexEdited >= 0) {
                setEditedMenus([...editedMenus.slice(0, indexEdited), ...editedMenus.slice(indexEdited + 1)]);
                if (indexInitial >= 0) changeMenus([...menus.slice(0, indexInitial), ...menus.slice(indexInitial + 1)]);
                setMenuEdit("");
                toast.success("Menu supprimé avec succès.");
            } else {
                toast.error("Impossible de supprimer ce menu spécial.");
            }
        }
    };

    return (
        <Box width={"100%"}>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
                <Typography variant={"h6"}>Menus spéciaux : {editedMenus.length ?? 0} / 3</Typography>
                {editEvent &&
                    <IconButton color={"primary"} size={"large"} onClick={createNewMenu}
                                disabled={editedMenus.length >= 3}>
                        <AddCircleOutlineIcon/>
                    </IconButton>
                }
            </Stack>
            <List disablePadding>
                {editedMenus.map(menu => (
                    <EventMenuListItem key={menu.shortName} menu={menu} editEvent={editEvent}
                                       editMenu={editEvent && menuEdit === menu.id} canAskMenuEdit={menuEdit === ""}
                                       askMenuEdit={() => askMenuEdit(menu.id)}
                                       changeEditedMenu={(newMenu: MenuEvent) => changeEditedMenu(menu.id, newMenu)}
                                       saveMenuEdit={(cancel?: boolean) => saveMenuEdit(menu.id, cancel)}
                                       deleteMenu={() => deleteMenu(menu.id)}
                    />
                ))}
            </List>
        </Box>
    );
}