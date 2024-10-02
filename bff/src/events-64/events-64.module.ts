import { Module } from '@nestjs/common';
import { Events64Controller } from './events-64.controller';
import { Events64Service } from './events-64.service';

@Module({
  controllers: [Events64Controller],
  providers: [Events64Service]
})
export class Events64Module {}
