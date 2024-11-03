import { Controller } from '@nestjs/common';
import { Get, Param } from '@nestjs/common';
import { TablesService } from './tables.service';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}
  @Get()
  getTables() {
    return this.tablesService.getAllTables();
  }

  @Get(':number')
  getTableByNumber(@Param('number') number: string) {
    return this.tablesService.getTableByNumber(number);
  }
}
