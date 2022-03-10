import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mint2Component } from './mint2.component';

describe('Mint2Component', () => {
  let component: Mint2Component;
  let fixture: ComponentFixture<Mint2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Mint2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Mint2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
