import { TestBed } from '@angular/core/testing';

import { NewsRateService } from './news-rate.service';

describe('NewsRateService', () => {
  let service: NewsRateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewsRateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
