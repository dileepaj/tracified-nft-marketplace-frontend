import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellNftConfirmationComponent } from './sell-nft-confirmation.component';

describe('SellNftConfirmationComponent', () => {
  let component: SellNftConfirmationComponent;
  let fixture: ComponentFixture<SellNftConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellNftConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellNftConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
