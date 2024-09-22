import {Cookie, LocalBar, Restaurant, Star, Tapas} from "@mui/icons-material";
import {List} from "@mui/material";
import {useMemo, useState} from "react";
import {MenuCategoryEnum, MenuItem} from "../../interfaces/Menu.ts";
import {menuNormal} from "../../mocks/Menu.ts";
import MenuListItem from "./MenuListItem.tsx";

export default function MenuList() {
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
        setBeverages(menuNormal.filter(item => item.category === MenuCategoryEnum.BEVERAGE));
        setStarters(menuNormal.filter(item => item.category === MenuCategoryEnum.STARTER));
        setCourses(menuNormal.filter(item => item.category === MenuCategoryEnum.MAIN));
        setDesserts(menuNormal.filter(item => item.category === MenuCategoryEnum.DESSERT));
        setSpecials(menuNormal.filter(item => item.category === MenuCategoryEnum.SPECIAL));
    }, []);

    const handleOpen = (category: MenuCategoryEnum) => {
        setOpen(prevState => ({...prevState, [category]: !prevState[category]}));
    };

    return (
        <List sx={{width: "100%"}}>
            <MenuListItem
                title={"BEVERAGES"}
                icon={<LocalBar/>}
                open={open[MenuCategoryEnum.BEVERAGE]}
                handleOpen={() => handleOpen(MenuCategoryEnum.BEVERAGE)}
                items={beverages}
            />
            <MenuListItem
                title={"STARTERS"}
                icon={<Tapas/>}
                open={open[MenuCategoryEnum.STARTER]}
                handleOpen={() => handleOpen(MenuCategoryEnum.STARTER)}
                items={starters}
            />
            <MenuListItem
                title={"MAIN COURSES"}
                icon={<Restaurant/>}
                open={open[MenuCategoryEnum.MAIN]}
                handleOpen={() => handleOpen(MenuCategoryEnum.MAIN)}
                items={courses}
            />
            <MenuListItem
                title={"DESSERTS"}
                icon={<Cookie/>}
                open={open[MenuCategoryEnum.DESSERT]}
                handleOpen={() => handleOpen(MenuCategoryEnum.DESSERT)}
                items={desserts}
            />
            {specials.length > 0 &&
                <MenuListItem
                    title={"SPECIALS"}
                    icon={<Star/>}
                    open={open[MenuCategoryEnum.SPECIAL]}
                    handleOpen={() => handleOpen(MenuCategoryEnum.SPECIAL)}
                    items={specials}
                />
            }
        </List>
    );
}