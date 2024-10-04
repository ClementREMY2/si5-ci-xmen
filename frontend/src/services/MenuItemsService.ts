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
  console.log("obj", obj);
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
        console.log(decoded);
        const decodedObj = JSON.parse(decoded);
        decodedObj.id = menuItem._id;
        return decodedObj;
      } catch (e) {
        console.log("error", e);
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

  console.log("menuItem", uniqueMenuItems);
  return uniqueMenuItems;
}

export const getMenuItems = async () => {
  try {
    const menuItems = await findAllMenus();
    console.log("menuItems", menuItems);
    return menuItems;
  } catch (error) {
    throw new Error("Failed to fetch menu items");
  }
};
