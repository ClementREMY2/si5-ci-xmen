import { Test, TestingModule } from '@nestjs/testing';
import { Tables64Service } from './tables-64.service';

describe('Tables64Service', () => {
  let service: Tables64Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Tables64Service],
    }).compile();

    service = module.get<Tables64Service>(Tables64Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
