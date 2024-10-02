import { Test, TestingModule } from '@nestjs/testing';
import { Items64Controller } from './items-64.controller';

describe('Items64Controller', () => {
  let controller: Items64Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Items64Controller],
    }).compile();

    controller = module.get<Items64Controller>(Items64Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
