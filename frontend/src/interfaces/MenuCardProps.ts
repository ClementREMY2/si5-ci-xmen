import {MenuEvent} from "./Menu.ts";

export interface MenuCardProps extends MenuEvent {
    onMenuUpdate: (updatedMenu: MenuEvent) => void;
    editing: boolean;
    allowEdit: boolean;
    isOnEdition: (yes: boolean) => void;
}
