import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagginatorComponent } from './pagginator.component';

describe('PagginatorComponent', () => {
  let component: PagginatorComponent;
  let fixture: ComponentFixture<PagginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagginatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
