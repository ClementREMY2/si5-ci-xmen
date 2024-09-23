export enum MenuCategoryEnum {
    BEVERAGE = "BEVERAGE",
    STARTER = "STARTER",
    MAIN = "MAIN",
    DESSERT = "DESSERT"
}

export interface MenuItem {
    id: string;
    fullName: string;
    shortName: string;
    price: number;
    category: MenuCategoryEnum;
}

export interface MenuEvent {
    id: string;
    name: string;
    price: number;
    menu: {[key: string]: MenuItem};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface MenuItemShort {
    name: string;
    price: number;
    category: string;
}

export interface Menu {
    title: string;
    entree: MenuItemShort;
    mainCourse: MenuItemShort;
    dessert: MenuItemShort;
    drink1: MenuItemShort;
    drink2: MenuItemShort;
    price: number;
}