import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { getAllEvents } from '../utils/event-utils';
import { Event } from 'src/interfaces/front/event.interface';


@Injectable()
export class EventsService {
    async findAll(): Promise<Event[] | PromiseLike<Event[]>> {
        try {
            const response = await axios.get('http://localhost:9500/menu/menus'); 
            return getAllEvents(response.data);
        } catch (error) {
            throw new Error(`Failed to fetch tables: ${error.message}`);
        }
    }
}
