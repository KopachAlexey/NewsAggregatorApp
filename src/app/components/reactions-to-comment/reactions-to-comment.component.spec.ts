import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactionsToCommentComponent } from './reactions-to-comment';

describe('ReactionsComponent', () => {
  let component: ReactionsToCommentComponent;
  let fixture: ComponentFixture<ReactionsToCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactionsToCommentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReactionsToCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
