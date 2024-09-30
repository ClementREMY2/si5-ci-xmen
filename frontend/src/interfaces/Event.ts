import {MenuEvent, MenuItem} from "./Menu.ts";

export enum EventCategoryEnum {
    TODAY = "Aujourd'hui",
    FUTURE = "Jours suivants",
    PAST = "Jours précédents"
}

export interface Event {
    id?: string;
    name: string;
    date: Date;
    menus: MenuEvent[];
    beverages: MenuItem[];
}

export type Events = {
    [key in EventCategoryEnum]: Event[];
}