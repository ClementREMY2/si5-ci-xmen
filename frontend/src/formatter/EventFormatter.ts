import { getAllMenuEvent, getAllMenuItem } from "./MenuFormatter";
import { MenuBackend, MenuBackendNoId } from "../interfaces/Menu";
import { Event, EventItem } from "../interfaces/Event";
import axios from "axios";
import { Buffer } from "buffer";



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

export function getOneEvent(menusBack: MenuBackend[], name: string) : Event | undefined {
    let event: Event | undefined;

    const menuMap = new Map<string, MenuBackend>();

    for (const menu of menusBack) {
        menuMap.set(menu._id.toString(), menu);
    }

    for (const menu of menusBack) {
        const [type, ...ids] = menu.fullName.split('|');
        if (type === 'event' && menu.shortName === name) {
            const relatedMenus = ids.map(id => menuMap.get(id)).filter(Boolean) as MenuBackend[];
            event = createEvent(menu, relatedMenus, menusBack);
        }
    }

    return event;
}

export function getTodayEvents(events: Event[]): EventItem[] {
    const today = new Date();
    const todayEvents = events.filter(event => {
        const eventDate = new Date(event.date);

        return eventDate.getFullYear() === today.getFullYear() &&
               eventDate.getMonth() === today.getMonth()

    });

    return todayEvents.map(event => {
        return {
            id: event.id ? parseInt(event.id.toString()) : 0,  // Assure que l'id est un nombre, 0 si undefined
            title: event.name,
            details: [`${event.menus.length} menus`, new Date(event.date).toLocaleDateString()]
        };
    });
}


export function getNextEvents(events: Event[]) : EventItem[] {
    const today = new Date();
    const nextEvents = events.filter(event => event.date > today);
    return nextEvents.map(event => {
        return {
            id: parseInt(event.id?.toString() as string),
            title: event.name,
            details: [`${event.menus.length} menus`, event.date.toLocaleDateString()]
        };
    });
}

export function postEvent(event: Event): MenuBackendNoId {
    const date = event.date;

    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const dateStr = `${year}${month < 10 ? '0' : ''}${month}${day < 10 ? '0' : ''}${day}`;

    const menu: MenuBackendNoId = {
        // and also beverages
        fullName: `event|${event.menus.map(menu => menu.id).join('|')+event.beverages.map(beverage => beverage.id).join('|')}`,
        shortName: event.name,
        price: parseInt(dateStr),
        category: 'STARTER',
        image: 'https://via.placeholder.com'
    };

    return menu;    
}

export async function findAllEvents(): Promise<Event[]> {
    const menuItems: MenuBackend[] = await axios
      .get('http://localhost:9500/menu/menus')
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(`Failed to fetch menus: ${error.message}`);
      });
  
    const fullNamesDecoded = menuItems
      .map((menuItem) => {
        try {
          const decoded = Buffer.from(menuItem.fullName, 'base64').toString(
            'ascii',
          );
          const decodedObj = JSON.parse(decoded);
          decodedObj.id = menuItem._id;
          return decodedObj;
        } catch (e) {
          return null;
        }
      })
      .filter((decoded) => decoded !== null)
      .filter(isEvent);

    return fullNamesDecoded;
}

function isEvent(obj: any): obj is Event {

        console.log("obj", obj)
        console.log("name", typeof obj.name === 'string' )
        console.log("date", typeof obj.date === 'string' )
        console.log("menus", typeof obj.menus === 'object' , obj.menus)
    
        return (
            typeof obj.name === 'string' &&
            typeof obj.date === 'string' &&
            typeof obj.menus === 'object' 
        );
}
  


    