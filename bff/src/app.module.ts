import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TablesModule } from './tables/tables.module';
import { MenuEventModule } from './menu-event/menu-event.module';
import { EventsModule } from './events/events.module';
import { OrdersModule } from './orders/orders.module';
import { Orders64Module } from './orders-64/orders-64.module';
import { Events64Module } from './events-64/events-64.module';
import { PaymentsModule } from './payments/payments.module';
import { Items64Module } from './items-64/items-64.module';
import { Tables64Module } from './tables-64/tables-64.module';
import { Menus64Module } from './menus-64/menus-64.module';

@Module({
  imports: [TablesModule, MenuEventModule, EventsModule, OrdersModule, Orders64Module, Events64Module, PaymentsModule, Items64Module, Tables64Module, Menus64Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
