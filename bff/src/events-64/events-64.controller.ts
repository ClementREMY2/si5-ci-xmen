import { Body, Controller, Get, Post } from '@nestjs/common';
import { Events64Service } from './events-64.service';
import { Event } from 'src/interfaces/front/event.interface';

@Controller('events-64')
export class Events64Controller {
    constructor(private readonly eventsService: Events64Service){}

    @Post()
    async createEvent(@Body() event: Event) {
        return this.eventsService.createEvent(event);
    }

    @Get()
    async findAllEvents() {
        return this.eventsService.findAllEvents();
    }
}
