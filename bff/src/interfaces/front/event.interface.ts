import { MenuEvent, MenuItem } from "./menu.interfaces";


export interface Event {
    id?: string;
    name: string;
    date: Date;
    menus: MenuEvent[];
    beverages: MenuItem[];
}