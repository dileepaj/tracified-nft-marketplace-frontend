import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OkmessageComponent } from './okmessage.component';

describe('OkmessageComponent', () => {
  let component: OkmessageComponent;
  let fixture: ComponentFixture<OkmessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OkmessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OkmessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
