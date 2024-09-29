import { Test, TestingModule } from '@nestjs/testing';
import { MenuEventController } from './menu-event.controller';

describe('MenuEventController', () => {
  let controller: MenuEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuEventController],
    }).compile();

    controller = module.get<MenuEventController>(MenuEventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
