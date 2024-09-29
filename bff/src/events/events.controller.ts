import { Controller, Get } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from '../interfaces/front/event.interface';

@Controller('events')
export class EventsController {
    constructor( private readonly eventsService: EventsService) {}

    @Get()
    async findAll() : Promise<Event[]> {
        return await this.eventsService.findAll();
    }
}
