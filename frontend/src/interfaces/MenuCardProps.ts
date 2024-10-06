import { MenuEvent } from "./Menu.ts";

export interface MenuCardProps {
  menu: MenuEvent;
  onMenuUpdate: (updatedMenu: MenuEvent) => void;
  editing: boolean;
  allowEdit: boolean;
  isOnEdition: (yes: boolean) => void;
}
