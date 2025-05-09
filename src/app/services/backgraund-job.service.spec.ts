import { TestBed } from '@angular/core/testing';

import { BackgraundJobService } from './backgraund-job.service';

describe('AppSettingsService', () => {
  let service: BackgraundJobService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackgraundJobService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
