import { Test, TestingModule } from '@nestjs/testing';
import { Items64Service } from './items-64.service';

describe('Items64Service', () => {
  let service: Items64Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Items64Service],
    }).compile();

    service = module.get<Items64Service>(Items64Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
