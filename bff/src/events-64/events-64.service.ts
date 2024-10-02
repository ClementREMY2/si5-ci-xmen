import { Injectable } from '@nestjs/common';
import { Menu } from 'src/interfaces/back/menu.interface';
import { Event } from 'src/interfaces/front/event.interface';
import { encodeObjectToBase64, saveMenu, findAllEvents as findAll } from 'src/utils/encode64-utils';

@Injectable()
export class Events64Service {
    async findAllEvents() {
        const events = await findAll();
        const uniqueEvents = new Map<string, Event>();
        events.forEach(event => {
            uniqueEvents.set(event.name, event);
        });
        return Array.from(uniqueEvents.values());
    }

    async createEvent(event: Event) {
        const menu = encodeObjectToBase64(event);
        const res: Menu = await saveMenu(menu);
        event.id = res._id;
        return event;
    }
}
