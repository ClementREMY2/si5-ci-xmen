import { MenuEvent, MenuItem } from "./menu.interfaces";


export interface Event {
    length: number;
    id?: string;
    name: string;
    date: Date;
    menus: MenuEvent[];
    beverages: MenuItem[];
}