import { Module } from '@nestjs/common';
import { Menus64Controller } from './menus-64.controller';
import { Menus64Service } from './menus-64.service';

@Module({
  controllers: [Menus64Controller],
  providers: [Menus64Service]
})
export class Menus64Module {}
