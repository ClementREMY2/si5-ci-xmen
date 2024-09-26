import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TablesModule } from './tables/tables.module';

@Module({
  imports: [TablesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
