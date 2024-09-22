import { Menu } from './Menu';

export interface MenuCardProps extends Menu {
    onMenuUpdate: (updatedMenu: Menu) => void;
    editing: boolean;
    allowEdit: boolean;
    isOnEdition: (yes: boolean) => void;
}
