import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TablesModule } from './tables/tables.module';
import { MenuEventModule } from './menu-event/menu-event.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [TablesModule, MenuEventModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
