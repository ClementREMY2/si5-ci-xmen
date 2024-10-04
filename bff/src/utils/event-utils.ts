import { Menu } from "src/interfaces/back/menu.interface";
import { Event } from "src/interfaces/front/event.interface";
import { getAllMenuEvent, getAllMenuItem } from "./menu-utils";

function createEvent(menu: Menu, relatedMenus: Menu[], menusBack: Menu[]) : Event {
    const foodMenus = relatedMenus.filter(relatedMenu => relatedMenu.fullName.split('|')[0] === 'menuEvent');
    const beverageMenus = relatedMenus.filter(relatedMenu => relatedMenu.fullName.split('|')[0] === 'beverage');

    const allMenus = getAllMenuEvent(menusBack);
    const menus = allMenus.filter(menu => foodMenus.map(foodMenu => foodMenu._id
        .toString()).includes(menu.id));

    const beverages = getAllMenuItem(beverageMenus);
    

    const dateStr = menu.price.toString();
    const year = parseInt(dateStr.substring(0, 4), 10);
    const month = parseInt(dateStr.substring(4, 6), 10) - 1; 
    const day = parseInt(dateStr.substring(6, 8), 10);

    const event: Event = {
        name: menu.shortName,
        date: new Date(year, month, day),
        menus: menus,
        beverages: beverages,
        id: menu._id,
        length: 0
    };

    return event;
}

export function getAllEvents(menusBack: Menu[]) : Event[] {
    const events: Event[] = [];

    const menuMap = new Map<string, Menu>();

    for (const menu of menusBack) {
        menuMap.set(menu._id.toString(), menu);
    }

    for (const menu of menusBack) {
        const [type, ...ids] = menu.fullName.split('|');
        if (type === 'event') {
            const relatedMenus = ids.map(id => menuMap.get(id)).filter(Boolean) as Menu[];
            const event = createEvent(menu, relatedMenus, menusBack);

            events.push(event);
        }
    }

    return events;
}

