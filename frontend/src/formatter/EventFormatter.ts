import { getAllMenuEvent, getAllMenuItem } from "./MenuFormatter";
import { MenuBackend, MenuBackendNoId } from "../interfaces/Menu";
import { Event } from "../interfaces/Event";

interface EventItem {
  id: string;
  title: string;
  details: string[];
}

function createEvent(
  menu: MenuBackend,
  relatedMenus: MenuBackend[],
  menusBack: MenuBackend[]
): Event {
  const foodMenus = relatedMenus.filter(
    (relatedMenu) => relatedMenu.fullName.split("|")[0] === "menuEvent"
  );
  const beverageMenus = relatedMenus.filter(
    (relatedMenu) => relatedMenu.fullName.split("|")[0] === "beverage"
  );

  const allMenus = getAllMenuEvent(menusBack);
  const menus = allMenus.filter((menu) =>
    foodMenus.map((foodMenu) => foodMenu._id.toString()).includes(menu.id)
  );

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
  };

  return event;
}

export function getAllEvents(menusBack: MenuBackend[]): Event[] {
  const events: Event[] = [];

  // const menuMap = new Map<string, MenuBackend>();

  // for (const menu of menusBack) {
  //     menuMap.set(menu._id.toString(), menu);
  // }

  // for (const menu of menusBack) {
  //     const [type, ...ids] = menu.fullName.split('|');
  //     if (type === 'event') {
  //         const relatedMenus = ids.map(id => menuMap.get(id)).filter(Boolean) as MenuBackend[];
  //         const event = createEvent(menu, relatedMenus, menusBack);

  //         events.push(event);
  //     }
  // }

  return events;
}

export function getOneEvent(
  menusBack: MenuBackend[],
  name: string
): Event | undefined {
  let event: Event | undefined;

  const menuMap = new Map<string, MenuBackend>();

  for (const menu of menusBack) {
    menuMap.set(menu._id.toString(), menu);
  }

  for (const menu of menusBack) {
    const [type, ...ids] = menu.fullName.split("|");
    if (type === "event" && menu.shortName === name) {
      const relatedMenus = ids
        .map((id) => menuMap.get(id))
        .filter(Boolean) as MenuBackend[];
      event = createEvent(menu, relatedMenus, menusBack);
    }
  }

  return event;
}

export function getTodayEvents(events: Event[]): EventItem[] {
  const today = new Date();
  const todayEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === today.getFullYear() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getDate() === today.getDate()
    );
  });
  return todayEvents.map((event) => {
    return {
      id: event.id?.toString() as string,
      title: event.name,
      details: [
        `${event.menus.length} menus`,
        new Date(event.date).toLocaleDateString(),
      ],
    };
  });
}

export function getNextEvents(events: Event[]): EventItem[] {
  const today = new Date();
  const nextEvents = events.filter((event) => new Date(event.date) > today);
  return nextEvents.map((event) => {
    return {
      id: event.id?.toString() as string,
      title: event.name,
      details: [
        `${event.menus.length} menus`,
        new Date(event.date).toLocaleDateString(),
      ],
    };
  });
}

export function postEvent(event: Event): MenuBackendNoId {
  const date = event.date;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const dateStr = `${year}${month < 10 ? "0" : ""}${month}${
    day < 10 ? "0" : ""
  }${day}`;

  const menu: MenuBackendNoId = {
    // and also beverages
    fullName: `event|${
      event.menus.map((menu) => menu.id).join("|") +
      event.beverages.map((beverage) => beverage.id).join("|")
    }`,
    shortName: event.name,
    price: parseInt(dateStr),
    category: "STARTER",
    image: "https://via.placeholder.com",
  };

  return menu;
}
