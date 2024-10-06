import { Controller, Get, Post } from '@nestjs/common';
import { TablesService } from './tables.service';
import { Table } from 'src/interfaces/front/table.interface';

@Controller('tables')
export class TablesController {
    constructor(private readonly tablesService: TablesService) {}

    @Get('/tables')
    async findAll(): Promise<Table[]> {
        return await this.tablesService.findAll();
    }

    @Post('/tables/' + )
    async updateATable(): Promise<string> {
        return await this.tablesService.update();
    }
    
}
