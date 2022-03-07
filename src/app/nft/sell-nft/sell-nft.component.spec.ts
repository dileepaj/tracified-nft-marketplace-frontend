import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellNftComponent } from './sell-nft.component';

describe('SellNftComponent', () => {
  let component: SellNftComponent;
  let fixture: ComponentFixture<SellNftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellNftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellNftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
