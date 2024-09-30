import { Test, TestingModule } from '@nestjs/testing';
import { MenuEventService } from './menu-event.service';

describe('MenuEventService', () => {
  let service: MenuEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuEventService],
    }).compile();

    service = module.get<MenuEventService>(MenuEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
