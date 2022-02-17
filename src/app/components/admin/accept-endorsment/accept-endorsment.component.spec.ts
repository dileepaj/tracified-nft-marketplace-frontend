import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptEndorsmentComponent } from './accept-endorsment.component';

describe('AcceptEndorsmentComponent', () => {
  let component: AcceptEndorsmentComponent;
  let fixture: ComponentFixture<AcceptEndorsmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptEndorsmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptEndorsmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
