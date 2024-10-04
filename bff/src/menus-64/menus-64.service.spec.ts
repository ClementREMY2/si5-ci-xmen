import { Test, TestingModule } from '@nestjs/testing';
import { Menus64Service } from './menus-64.service';

describe('Menus64Service', () => {
  let service: Menus64Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Menus64Service],
    }).compile();

    service = module.get<Menus64Service>(Menus64Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
