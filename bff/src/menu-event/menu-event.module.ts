import { Module } from '@nestjs/common';
import { MenuEventController } from './menu-event.controller';
import { MenuEventService } from './menu-event.service';

@Module({
  controllers: [MenuEventController],
  providers: [MenuEventService]
})
export class MenuEventModule {}
