import { Test, TestingModule } from '@nestjs/testing';
import { Orders64Service } from './orders-64.service';

describe('Orders64Service', () => {
  let service: Orders64Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Orders64Service],
    }).compile();

    service = module.get<Orders64Service>(Orders64Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
