import {Cookie, LocalBar, Restaurant, Tapas} from "@mui/icons-material";
import {List} from "@mui/material";
import {useState} from "react";
import {Menu, MenuCategoryEnum} from "../../interfaces/Menu.ts";
import {OrderItems} from "../../interfaces/Order.ts";
import MenuListItem from "./MenuListItem.tsx";

interface MenuListProps {
    menu: Menu;
    orderItems: OrderItems;
    changeItemQuantity: (id: string, delta: number) => void;
}

const menuList = [
    {key: "1", category: MenuCategoryEnum.BEVERAGE, icon: <LocalBar color={"primary"}/>},
    {key: "2", category: MenuCategoryEnum.STARTER, icon: <Tapas color={"primary"}/>},
    {key: "3", category: MenuCategoryEnum.MAIN, icon: <Restaurant color={"primary"}/>},
    {key: "4", category: MenuCategoryEnum.DESSERT, icon: <Cookie color={"primary"}/>}
];

export default function MenuList({menu, orderItems, changeItemQuantity}: Readonly<MenuListProps>) {
    const [open, setOpen] = useState<{ [key in MenuCategoryEnum]: boolean }>({
        [MenuCategoryEnum.BEVERAGE]: true,
        [MenuCategoryEnum.STARTER]: true,
        [MenuCategoryEnum.MAIN]: true,
        [MenuCategoryEnum.DESSERT]: true
    });

    const handleOpen = (category: MenuCategoryEnum) => {
        setOpen(prevState => ({...prevState, [category]: !prevState[category]}));
    };

    console.log("menuList", JSON.stringify(menuList));
    return (
        <List sx={{width: "100%"}}>
            {menuList.map(({key, category, icon}) => (
                menu[category].length > 0 &&
                <MenuListItem
                    key={key}
                    title={category.toUpperCase()}
                    icon={icon}
                    menuItems={menu[category]}
                    orderItems={orderItems}
                    changeItemQuantity={changeItemQuantity}
                    open={open[category]}
                    handleOpen={() => handleOpen(category)}
                />
            ))}
        </List>
    );
}