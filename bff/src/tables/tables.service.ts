import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { table } from 'console';

@Injectable()
export class TablesService {
    private readonly tables = [];

    tableFromBackToFront(backTable) {
        const tableOrderId = backTable.tableOrderId.split('|');
        const frontTable = {
            id: backTable.id,
            table: backTable.number,
            taken: true,
            nbPeople: tableOrderId[0],
            event: tableOrderId[1],
            status: tableOrderId[2]
        }
        return frontTable;
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
