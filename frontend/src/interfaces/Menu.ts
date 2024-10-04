export enum MenuCategoryEnum {
    BEVERAGE = "Boisson",
    STARTER = "Entrée",
    MAIN = "Plat",
    DESSERT = "Dessert"
}

export interface GenericMenuItem {
    id: string;
    fullName: string;
    shortName: string;
    price: number;
}

export interface MenuItem extends GenericMenuItem {
    category: MenuCategoryEnum;
}

export interface MenuEvent extends GenericMenuItem {
    menu: {[key: string]: MenuItem};
}

export type Menu = {
    [key in MenuCategoryEnum]: MenuItem[]
}

export interface MenuBackend {
    _id: string,
    fullName: string,
    shortName: string,
    price: number,
    category: MenuCategoryEnumBackend,
    image: string
}

export interface MenuBackendNoId {
    fullName: string,
    shortName: string,
    price: number,
    category: string,
    image: string
}

export enum MenuCategoryEnumBackend {
    BEVERAGE,
    STARTER,
    MAIN,
    DESSERT 
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface MenuItemShort {
    name: string;
    price: number;
    category: string;
}

export interface OldMenu {
    title: string;
    entree: MenuItemShort;
    mainCourse: MenuItemShort;
    dessert: MenuItemShort;
    drink1: MenuItemShort;
    drink2: MenuItemShort;
    price: number;
}