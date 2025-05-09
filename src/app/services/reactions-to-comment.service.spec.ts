import { TestBed } from '@angular/core/testing';

import { ReactionsToCommentService } from './reactions-to-comment.service';

describe('ReactionsToCommentService', () => {
  let service: ReactionsToCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReactionsToCommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
