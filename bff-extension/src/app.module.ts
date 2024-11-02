import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersController } from './orders/orders.controller';
import { OrdersModule } from './orders/orders.module';
import { TablesModule } from './tables/tables.module';

@Module({
  imports: [OrdersModule, TablesModule],
  controllers: [AppController, OrdersController],
  providers: [AppService],
})
export class AppModule {}
