export enum MenuCategoryEnum {
    BEVERAGE = "BEVERAGE",
    STARTER = "STARTER",
    MAIN = "MAIN",
    DESSERT = "DESSERT",
    SPECIAL = "SPECIAL"
}

export interface MenuItem {
    id: string;
    fullName: string;
    shortName: string;
    price: number;
    category: MenuCategoryEnum;
    image?: string;
}
import { MenuItem } from './MenuItem';

export interface Menu {
    title: string;
    entree: MenuItem;
    mainCourse: MenuItem;
    dessert: MenuItem;
    drink1: MenuItem;
    drink2: MenuItem;
    price: number;
}