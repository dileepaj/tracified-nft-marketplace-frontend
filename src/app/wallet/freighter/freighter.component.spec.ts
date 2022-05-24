import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreighterComponent } from './freighter.component';

describe('FreighterComponent', () => {
  let component: FreighterComponent;
  let fixture: ComponentFixture<FreighterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreighterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreighterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
