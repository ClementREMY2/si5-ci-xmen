import { Body, Controller, Get, Post } from '@nestjs/common';
import { Menus64Service } from './menus-64.service';
import { MenuItem } from 'src/interfaces/front/menu.interfaces';

@Controller('menus-64')
export class Menus64Controller {
    constructor(private readonly menusService: Menus64Service) {}

    @Post()
    async saveMenu(@Body() menu: MenuItem) {
        return this.menusService.saveMenu(menu);
    }

    @Get()
    async findAllMenus() {
        return this.menusService.findAllMenus();
    }
}
