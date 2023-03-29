import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSellComponent } from './confirm-sell.component';

describe('ConfirmSellComponent', () => {
  let component: ConfirmSellComponent;
  let fixture: ComponentFixture<ConfirmSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmSellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
