import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TablesService {
  private tableStateMap: Map<string, string> = new Map();

  setTableState(tableNumber: string, state: string) {
    this.tableStateMap.set(tableNumber, state);
  }

  getTableState(tableNumber: string): string | undefined {
    return this.tableStateMap.get(tableNumber);
  }
  async getAllTables() {
    try {
      const response = await axios.get('http://localhost:9500/dining/tables');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }
  }

  async getTableByNumber(number: string) {
    try {
      const response = await axios.get(
        `http://localhost:9500/dining/tables/${number}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch order: ${error.message}`);
    }
  }
}
