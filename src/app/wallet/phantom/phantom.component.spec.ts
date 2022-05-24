import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhantomComponent } from './phantom.component';

describe('PhantomComponent', () => {
  let component: PhantomComponent;
  let fixture: ComponentFixture<PhantomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhantomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhantomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
