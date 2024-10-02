import { Module } from '@nestjs/common';
import { Orders64Controller } from './orders-64.controller';
import { Orders64Service } from './orders-64.service';

@Module({
  controllers: [Orders64Controller],
  providers: [Orders64Service]
})
export class Orders64Module {}
