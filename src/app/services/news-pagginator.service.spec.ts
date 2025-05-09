import { TestBed } from '@angular/core/testing';

import { NewsPagginatorService } from './news-pagginator.service';

describe('NewsPagginatorService', () => {
  let service: NewsPagginatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewsPagginatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
