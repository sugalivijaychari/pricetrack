import { Test, TestingModule } from '@nestjs/testing';
import { PriceTrackerService } from './price-tracker.service';

describe('PriceTrackerService', () => {
  let service: PriceTrackerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PriceTrackerService],
    }).compile();

    service = module.get<PriceTrackerService>(PriceTrackerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
