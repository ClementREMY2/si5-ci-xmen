import { Test, TestingModule } from '@nestjs/testing';
import { Events64Service } from './events-64.service';

describe('Events64Service', () => {
  let service: Events64Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Events64Service],
    }).compile();

    service = module.get<Events64Service>(Events64Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
