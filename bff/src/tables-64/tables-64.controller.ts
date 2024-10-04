import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Tables64Service } from './tables-64.service';
import { Table } from 'src/interfaces/front/table.interface';

@Controller('tables-64')
export class Tables64Controller {
    constructor(private readonly tablesService: Tables64Service){}

    @Get()
    async findAllTables() {
        return this.tablesService.findAllTables();
    }

    @Post()
    async saveTable(@Body() table: Table) {
        return this.tablesService.saveTable(table);
    }

    @Get(':tableNumber')
    async getTable(@Param('tableNumber') tableNumber: number) {
        return this.tablesService.getTable(tableNumber);
    }
}
