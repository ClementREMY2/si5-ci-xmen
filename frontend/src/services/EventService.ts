import axios from "axios";
import { Event } from "../interfaces/Event";
import { Buffer } from "buffer";

interface Menu {
  _id: string;
  fullName: string;
  shortName: string;
  price: number;
  category: "STARTER" | "MAIN" | "DESSERT";
  image: string;
}

export async function getEvents(): Promise<Event[]> {
  const events = await findAllEvents();
  const uniqueEvents = new Map<string, Event>();
  events.forEach((event) => {
    uniqueEvents.set(event.name, event);
  });
  return Array.from(uniqueEvents.values());
}

async function findAllEvents(): Promise<Event[]> {
  const menuItems: Menu[] = await axios
    .get("http://localhost:9500/menu/menus")
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(`Failed to fetch menus: ${error.message}`);
    });

  const fullNamesDecoded = menuItems
    .map((menuItem) => {
      try {
        const decoded = Buffer.from(menuItem.fullName, "base64").toString(
          "ascii"
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
  return (
    typeof obj.name === "string" &&
    typeof obj.date === "string" &&
    typeof obj.menus === "object"
  );
}
