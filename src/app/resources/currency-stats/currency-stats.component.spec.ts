import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyStatsComponent } from './currency-stats.component';

describe('CurrencyStatsComponent', () => {
  let component: CurrencyStatsComponent;
  let fixture: ComponentFixture<CurrencyStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
