import {Cookie, LocalBar, Restaurant, Star, Tapas} from "@mui/icons-material";
import {List} from "@mui/material";
import {useMemo, useState} from "react";
import {MenuCategoryEnum, MenuItem} from "../../interfaces/Menu.ts";
import {Order} from "../../interfaces/Order.ts";
import MenuListItem from "./MenuListItem.tsx";

interface MenuListProps {
    menu: MenuItem[];
    order: Order;
    changeItemQuantity: (id: string, delta: number) => void;
}

export default function MenuList({menu, order, changeItemQuantity}: Readonly<MenuListProps>) {
    const [open, setOpen] = useState({
        "BEVERAGE": true,
        "STARTER": true,
        "MAIN": true,
        "DESSERT": true,
        "SPECIAL": false
    });
    const [beverages, setBeverages] = useState<MenuItem[]>([]);
    const [starters, setStarters] = useState<MenuItem[]>([]);
    const [courses, setCourses] = useState<MenuItem[]>([]);
    const [desserts, setDesserts] = useState<MenuItem[]>([]);
    const [specials, setSpecials] = useState<MenuItem[]>([]);

    useMemo(() => {
        setBeverages(menu.filter(item => item.category === MenuCategoryEnum.BEVERAGE));
        setStarters(menu.filter(item => item.category === MenuCategoryEnum.STARTER));
        setCourses(menu.filter(item => item.category === MenuCategoryEnum.MAIN));
        setDesserts(menu.filter(item => item.category === MenuCategoryEnum.DESSERT));
        setSpecials(menu.filter(item => item.category === MenuCategoryEnum.SPECIAL));
    }, [menu]);

    const handleOpen = (category: MenuCategoryEnum) => {
        setOpen(prevState => ({...prevState, [category]: !prevState[category]}));
    };

    return (
        <List sx={{width: "100%"}}>
            <MenuListItem
                title={"BEVERAGES"}
                icon={<LocalBar/>}
                items={beverages}
                order={order}
                changeItemQuantity={changeItemQuantity}
                open={open[MenuCategoryEnum.BEVERAGE]}
                handleOpen={() => handleOpen(MenuCategoryEnum.BEVERAGE)}
            />
            <MenuListItem
                title={"STARTERS"}
                icon={<Tapas/>}
                items={starters}
                order={order}
                changeItemQuantity={changeItemQuantity}
                open={open[MenuCategoryEnum.STARTER]}
                handleOpen={() => handleOpen(MenuCategoryEnum.STARTER)}
            />
            <MenuListItem
                title={"MAIN COURSES"}
                icon={<Restaurant/>}
                items={courses}
                order={order}
                changeItemQuantity={changeItemQuantity}
                open={open[MenuCategoryEnum.MAIN]}
                handleOpen={() => handleOpen(MenuCategoryEnum.MAIN)}
            />
            <MenuListItem
                title={"DESSERTS"}
                icon={<Cookie/>}
                items={desserts}
                order={order}
                changeItemQuantity={changeItemQuantity}
                open={open[MenuCategoryEnum.DESSERT]}
                handleOpen={() => handleOpen(MenuCategoryEnum.DESSERT)}
            />
            {specials.length > 0 &&
                <MenuListItem
                    title={"SPECIALS"}
                    icon={<Star/>}
                    items={specials}
                    order={order}
                    changeItemQuantity={changeItemQuantity}
                    open={open[MenuCategoryEnum.SPECIAL]}
                    handleOpen={() => handleOpen(MenuCategoryEnum.SPECIAL)}
                />
            }
        </List>
    );
}