import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustWorthComponent } from './trust-worth.component';

describe('TrustWorthComponent', () => {
  let component: TrustWorthComponent;
  let fixture: ComponentFixture<TrustWorthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrustWorthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrustWorthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
