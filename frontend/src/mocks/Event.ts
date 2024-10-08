import {Event} from "../interfaces/Event.ts";
import {menuNormalMock, menusAvisto} from "./Menu.ts";

export const eventsMock: Event[] = [
    {
        id: "1",
        name: "Avisto",
        date: new Date("2024-09-22"),
        menus: menusAvisto,
        beverages: menuNormalMock.slice(0, 4)
    },
    {
        id: "2",
        name: "SAP",
        date: new Date("2024-09-23"),
        menus: menusAvisto.slice(0, 2),
        beverages: menuNormalMock.slice(0, 3)
    },
    {
        id: "3",
        name: "Air France",
        date: new Date("2024-09-30"),
        menus: menusAvisto.slice(1, 3),
        beverages: menuNormalMock.slice(1, 4)
    }
];