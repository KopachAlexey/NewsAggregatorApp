import { TestBed } from '@angular/core/testing';

import { NewsServices } from './news.service';

describe('NewsServicesService', () => {
  let service: NewsServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewsServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
