import { Controller, Get } from '@nestjs/common';
import { MenuEvent } from '../interfaces/front/menu.interfaces';
import { MenuEventService } from './menu-event.service';

@Controller('menu-event')
export class MenuEventController {
    constructor(private readonly menuEventService: MenuEventService){}
    
    @Get()
    async findAll() : Promise<MenuEvent[]> {
        return this.menuEventService.findAll();
    }
    

    @Get(':id')
    async findOne(id: string) : Promise<MenuEvent> {
        return this.menuEventService.findOne(id);
    }

}
