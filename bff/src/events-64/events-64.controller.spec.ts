import { Test, TestingModule } from '@nestjs/testing';
import { Events64Controller } from './events-64.controller';

describe('Events64Controller', () => {
  let controller: Events64Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Events64Controller],
    }).compile();

    controller = module.get<Events64Controller>(Events64Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
