import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyViewComponent } from './buy-view.component';

describe('BuyViewComponent', () => {
  let component: BuyViewComponent;
  let fixture: ComponentFixture<BuyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
