import { GenericMenuItem, MenuBackend, MenuBackendNoId, MenuCategoryEnum, MenuCategoryEnumBackend, MenuEvent, MenuItem } from "../interfaces/Menu";
import { addMenu as addMenuBackend, getMenuById, getMenusGateway } from "../services/MenuService";

// Return a table from a backend table
const 
transformMenuData = (dto: MenuBackend[]): GenericMenuItem[] => {
        return dto.map((menuDto) => {
                        const table: GenericMenuItem = {
                                id: menuDto._id,
                                fullName: menuDto.fullName,
                                shortName: menuDto.shortName,
                                price: menuDto.price,                
                        };

                return table;
        });
};

export const getMenusBackend = async (): Promise<MenuBackend[]> => {
        return await getMenusGateway();
}

// Get all the menus from the backend
export const getMenus = async (): Promise<GenericMenuItem[]> => {
        const tables: MenuBackend[] = await getMenusBackend();
        return transformMenuData(tables);
};

// Add a menu to the backend
export const addMenu = async (newMenuItem: MenuBackendNoId) => {
        return await addMenuBackend(newMenuItem);
};

export const findMenuById = async (id: string): Promise<GenericMenuItem> => {
        return await getMenuById(id);
}


///////////////////////////////////////////////////////////////////


export function getCategory(menu: MenuBackend): MenuCategoryEnum {
        if (menu.fullName.split('|')[0] === 'beverage') {
                return MenuCategoryEnum.BEVERAGE;
        } else {
                switch (menu.category) {
                        case MenuCategoryEnumBackend.STARTER:
                                return MenuCategoryEnum.STARTER;
                        case MenuCategoryEnumBackend.MAIN:
                                return MenuCategoryEnum.MAIN;
                        case MenuCategoryEnumBackend.DESSERT:
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
export function getAllMenuEvent(menusBack: MenuBackend[]): MenuEvent[] {
        const menuEvents: MenuEvent[] = [];

        const menuMap = new Map<string, MenuBackend>();

        for (const menu of menusBack) {
                menuMap.set(menu._id.toString(), menu);
        }

        for (const menu of menusBack) {
                const [type, ...ids] = menu.fullName.split('|');
                if (type === 'menuEvent') {
                        const relatedMenus = ids.map(id => menuMap.get(id)).filter(Boolean) as MenuBackend[];
                        const menuEvent = createMenuEvent(menu, relatedMenus);

                        menuEvents.push(menuEvent);
                }
        }

        return menuEvents;
}

export async function getOneMenuEvent(id: string, menu: MenuBackend): Promise<MenuEvent> {
        const [type, ...ids] = menu.fullName.split('|');
        if (type !== 'menuEvent') {
                throw new Error(`Menu with id ${id} is not a menuEvent`);
        }

        const relatedMenus = await Promise.all(ids.map(async id => {
                const response = await getMenuById(id);
                return response.data;
        }));

        const menuEvent = createMenuEvent(menu, relatedMenus);

        return menuEvent;
}

export function createMenuEvent(menu: MenuBackend, relatedMenus: MenuBackend[]): MenuEvent {
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

export function createMenuItem(menu: MenuBackend) {
        return {
                id: menu._id,
                fullName: menu.fullName.split('|')[1],
                shortName: menu.shortName,
                price: menu.price,
                category: getCategory(menu)
        };
}

export function getAllMenuItem(menus: MenuBackend[]): MenuItem[] {
        return menus.map(menu => createMenuItem(menu));
}

