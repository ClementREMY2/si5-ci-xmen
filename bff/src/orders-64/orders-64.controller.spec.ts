import { Test, TestingModule } from '@nestjs/testing';
import { Orders64Controller } from './orders-64.controller';

describe('Orders64Controller', () => {
  let controller: Orders64Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Orders64Controller],
    }).compile();

    controller = module.get<Orders64Controller>(Orders64Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
