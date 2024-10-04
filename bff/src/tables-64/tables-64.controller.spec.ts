import { Test, TestingModule } from '@nestjs/testing';
import { Tables64Controller } from './tables-64.controller';

describe('Tables64Controller', () => {
  let controller: Tables64Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Tables64Controller],
    }).compile();

    controller = module.get<Tables64Controller>(Tables64Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
