import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintPopupComponent } from './mint-popup.component';

describe('MintPopupComponent', () => {
  let component: MintPopupComponent;
  let fixture: ComponentFixture<MintPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MintPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MintPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
