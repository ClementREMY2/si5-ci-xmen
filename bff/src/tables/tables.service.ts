import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { table } from 'console';

@Injectable()
export class TablesService {
    private readonly tables = [];

    tableFromBackToFront(backTable) {
        return backTable // TODO: setup the map between back and front 
    }
    

    async findAll(): Promise<string> {
        try {
            const response = await axios.get('http://localhost:9500/dining/tables');
            return JSON.stringify(this.tableFromBackToFront(response.data));
        } catch (error) {
            throw new Error(`Failed to fetch tables: ${error.message}`);
        }
    }
    
}
