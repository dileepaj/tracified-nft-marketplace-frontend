import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PutOnResaleComponent } from './put-on-resale.component';

describe('PutOnResaleComponent', () => {
  let component: PutOnResaleComponent;
  let fixture: ComponentFixture<PutOnResaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PutOnResaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PutOnResaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
