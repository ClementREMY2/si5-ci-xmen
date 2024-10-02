import { Module } from '@nestjs/common';
import { Items64Controller } from './items-64.controller';
import { Items64Service } from './items-64.service';

@Module({
  controllers: [Items64Controller],
  providers: [Items64Service]
})
export class Items64Module {}
