import axios from "axios";
import { MenuItem } from "../interfaces/Menu";
import { Buffer } from "buffer";

interface Menu {
  _id: string;
  fullName: string;
  shortName: string;
  price: number;
  category: "STARTER" | "MAIN" | "DESSERT";
  image: string;
}

function isMenuItem(obj: any): obj is MenuItem {
  return (
    typeof obj.fullName === "string" &&
    typeof obj.price === "number" &&
    typeof obj.shortName === "string" &&
    typeof obj.category === "string"
  );
}

async function findAllMenus(): Promise<MenuItem[]> {
  const menuItems: Menu[] = await axios
    .get("http://localhost:9500/menu/menus")
    .then((response: { data: any }) => response.data)
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
    .filter(isMenuItem);
  const uniqueMenuItems: MenuItem[] = fullNamesDecoded.reduce(
    (acc: MenuItem[], menuItem: MenuItem) => {
      const existingMenuItem = acc.find(
        (item) => item.shortName === menuItem.shortName
      );
      if (!existingMenuItem) {
        acc.push(menuItem);
      } else {
        const index = acc.indexOf(existingMenuItem);
        acc[index] = menuItem;
      }
      return acc;
    },
    []
  );

  return uniqueMenuItems;
}

export const getMenuItems = async () => {
  try {
    const menuItems = await findAllMenus();
    return menuItems;
  } catch (error) {
    throw new Error("Failed to fetch menu items");
  }
};

export const getMenuItemById = async (id: string) => {
  try {
    const menuItems = await findAllMenus();
    const menuItem = menuItems.find((item) => item.id === id);
    if (!menuItem) {
      throw new Error("Menu item not found");
    }
    return menuItem;
  } catch (error) {
    throw new Error("Failed to fetch menu item");
  }
};
