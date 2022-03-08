import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptEndorsementComponent } from './accept-endorsement.component';

describe('AcceptEndorsementComponent', () => {
  let component: AcceptEndorsementComponent;
  let fixture: ComponentFixture<AcceptEndorsementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptEndorsementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptEndorsementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
