import { Injectable } from '@nestjs/common';
import { findAllTables as findAll} from '../utils/encode64-utils';
import { Table } from 'src/interfaces/front/table.interface';
import {saveTable as save, findTable} from '../utils/encode64-utils';

@Injectable()
export class Tables64Service {
    getTable(tableNumber: number) {
        return findTable(tableNumber);
    }

    saveTable(table: Table) {
        return save(table);
    }

    findAllTables() {
        return findAll();
    }
}
