import {MenuEvent, MenuItem} from "./Menu.ts";

export interface Event {
    id?: string;
    name: string;
    date: Date;
    menus: MenuEvent[];
    beverages: MenuItem[];
}