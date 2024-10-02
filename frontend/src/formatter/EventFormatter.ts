import { getAllMenuEvent, getAllMenuItem } from "./MenuFormatter";
import { MenuBackend } from "../interfaces/Menu";
import { Event } from "../interfaces/Event";



function createEvent(menu: MenuBackend, relatedMenus: MenuBackend[], menusBack: MenuBackend[]) : Event {
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
        id: menu._id
    };

    return event;
}

export function getAllEvents(menusBack: MenuBackend[]) : Event[] {
    const events: Event[] = [];

    const menuMap = new Map<string, MenuBackend>();

    for (const menu of menusBack) {
        menuMap.set(menu._id.toString(), menu);
    }

    for (const menu of menusBack) {
        const [type, ...ids] = menu.fullName.split('|');
        if (type === 'event') {
            const relatedMenus = ids.map(id => menuMap.get(id)).filter(Boolean) as MenuBackend[];
            const event = createEvent(menu, relatedMenus, menusBack);

            events.push(event);
        }
    }

    return events;
}