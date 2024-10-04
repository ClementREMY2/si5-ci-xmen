import { Test, TestingModule } from '@nestjs/testing';
import { Menus64Controller } from './menus-64.controller';

describe('Menus64Controller', () => {
  let controller: Menus64Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Menus64Controller],
    }).compile();

    controller = module.get<Menus64Controller>(Menus64Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
