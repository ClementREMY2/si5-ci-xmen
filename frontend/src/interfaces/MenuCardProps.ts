import { Menu } from './Menu';

export interface MenuCardProps  extends Menu {
    onMenuUpdate: (updatedMenu: Menu) => void;
}
