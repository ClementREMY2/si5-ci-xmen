import { Injectable } from '@nestjs/common';
import { Menu } from 'src/interfaces/back/menu.interface';
import { MenuItem } from 'src/interfaces/front/menu.interfaces';
import { encodeObjectToBase64, saveMenu as save, findAllMenus } from 'src/utils/encode64-utils';


@Injectable()
export class Menus64Service {
    findAllMenus() {
        return findAllMenus();
    }
    async saveMenu(menu: MenuItem) {
        const encodedMenu = encodeObjectToBase64(menu);
        const res : Menu = await save(encodedMenu);
        menu.id = res._id;
        return menu;
    }
}
