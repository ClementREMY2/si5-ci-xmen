import { MenuCategoryEnum, MenuEvent, MenuItem } from '../interfaces/front/menu.interfaces';
import { Menu } from '../interfaces/back/menu.interface';
import axios from 'axios';

export function getCategory(menu: Menu): MenuCategoryEnum {
    if (menu.fullName.split('|')[0] === 'beverage') {
        return MenuCategoryEnum.BEVERAGE;
    } else {
        switch (menu.category) {
            case 'STARTER':
                return MenuCategoryEnum.STARTER;
            case 'MAIN':
                return MenuCategoryEnum.MAIN;
            case 'DESSERT':
                return MenuCategoryEnum.DESSERT;
            default:
                throw new Error(`Unknown category for menu: ${menu.fullName}`);
        }
    }
}

/**
 * go through all the menus in the back, get all the menuEvent and its menuItem
 * @param menusBack response from menu/menus
 */
export function getAllMenuEvent(menusBack: Menu[]) : MenuEvent[] { 
    const menuEvents: MenuEvent[] = [];

    const menuMap = new Map<string, Menu>();

    for (const menu of menusBack) {
        menuMap.set(menu._id.toString(), menu);
    }

    for (const menu of menusBack) {
        const [type, ...ids] = menu.fullName.split('|');
        if (type === 'menuEvent') {
        const relatedMenus = ids.map(id => menuMap.get(id)).filter(Boolean) as Menu[];
        const menuEvent = createMenuEvent(menu, relatedMenus);

        menuEvents.push(menuEvent);
        }
    }

    return menuEvents;
}


export async function getOneMenuEvent(id: string, menu: Menu) : Promise<MenuEvent> {
    const [type, ...ids] = menu.fullName.split('|');
    if (type !== 'menuEvent') {
        throw new Error(`Menu with id ${id} is not a menuEvent`);
    }

    const relatedMenus = await Promise.all(ids.map(async id => {
        const response = await axios.get(`http://localhost:9500/menu/menus/${id}`);
        return response.data;
    }));

    const menuEvent = createMenuEvent(menu, relatedMenus);

    return menuEvent;
}

export function createMenuEvent(menu: Menu, relatedMenus: Menu[]) : MenuEvent {
    const menuEvent: MenuEvent = {
        fullName: menu.shortName,
        shortName: menu.shortName,
        price: menu.price,
        menu: Object.fromEntries(relatedMenus.map(relatedMenu => {
            const category = getCategory(relatedMenu);
            return [category, createMenuItem(relatedMenu)];
        })),
        id: menu._id
    };

    return menuEvent;
}

export function createMenuItem(menu: Menu) {
    return {
        id: menu._id,
        fullName: menu.fullName.split('|')[1],
        shortName: menu.shortName,
        price: menu.price,
        category: getCategory(menu)
    };
}

export function getAllMenuItem(menus: Menu[]) : MenuItem[] {
    return menus.map(menu => createMenuItem(menu));
}