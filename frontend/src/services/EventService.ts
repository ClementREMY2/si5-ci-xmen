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

export async function getEvent(id: string): Promise<Event> {
  const event = await axios
    .get(`http://localhost:9500/menu/menus/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(`Failed to fetch menu: ${error.message}`);
    });
  const decoded = Buffer.from(event.fullName, "base64").toString("ascii");
  const decodedObj = JSON.parse(decoded);
  decodedObj.id = event._id;
  if (isEvent(decodedObj)) {
    return decodedObj;
  }
  throw new Error("Invalid event");
}

function isEvent(obj: any): obj is Event {
  return (
    typeof obj.name === "string" &&
    typeof obj.date === "string" &&
    typeof obj.menus === "object"
  );
}

export async function saveEvent(event: Event): Promise<void> {
  const encodedEvent = Buffer.from(JSON.stringify(event)).toString("base64");
  await axios
    .post("http://localhost:9500/menu/menus", {
      fullName: encodedEvent,
      shortName: "event|" + new Date().toISOString(),
      price: 10,
      category: "STARTER",
      image: "https://via.placeholder.com/150",
    })
    .catch((error) => {
      throw new Error(`Failed to save event: ${error.message}`);
    });
}
