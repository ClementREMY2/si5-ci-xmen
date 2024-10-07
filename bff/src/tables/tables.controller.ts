import { Body, Controller, Get, Post } from '@nestjs/common';
import { TablesService } from './tables.service';
import { Table } from 'src/interfaces/front/table.interface';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

    @Get()
    async findAll(): Promise<Table[]> {
        return await this.tablesService.findAll();
    }

    @Post()
    async updateATable(@Body() table: Table): Promise<Table> {
        const t = await this.tablesService.update(table);
        table.id = t._id;
        return table;  
    }
    
}
