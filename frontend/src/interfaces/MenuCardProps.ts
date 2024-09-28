import {OldMenu} from "./Menu.ts";

export interface MenuCardProps extends OldMenu {
    onMenuUpdate: (updatedMenu: OldMenu) => void;
    editing: boolean;
    allowEdit: boolean;
    isOnEdition: (yes: boolean) => void;
}
