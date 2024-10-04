import { Module } from '@nestjs/common';
import { Tables64Controller } from './tables-64.controller';
import { Tables64Service } from './tables-64.service';

@Module({
  controllers: [Tables64Controller],
  providers: [Tables64Service]
})
export class Tables64Module {}
