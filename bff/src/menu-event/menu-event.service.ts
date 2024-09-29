import { Injectable } from '@nestjs/common';
import { MenuEvent } from '../interfaces/front/menu.interfaces';
import axios from 'axios';
import { getAllMenuEvent, getOneMenuEvent } from '../utils/menu-utils';

@Injectable()
export class MenuEventService {

    async findAll(): Promise<MenuEvent[]> {
        try {
            const response = await axios.get('http://localhost:9500/menu/menus'); 

            return getAllMenuEvent(response.data);
        } catch (error) {
            throw new Error(`Failed to fetch tables: ${error.message}`);
        }
    }

    async findOne(id: string): Promise<MenuEvent> {
        try {
            const response = await axios.get(`http://localhost:9500/menu/menus/${id}`);

            return getOneMenuEvent(id, response.data);
        } catch (error) {
            throw new Error(`Failed to fetch tables: ${error.message}`);
        }
    }
}
