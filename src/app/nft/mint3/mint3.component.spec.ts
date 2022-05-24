import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mint3Component } from './mint3.component';

describe('Mint3Component', () => {
  let component: Mint3Component;
  let fixture: ComponentFixture<Mint3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Mint3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Mint3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
