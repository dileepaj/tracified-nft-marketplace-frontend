import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSvgComponent } from './view-svg.component';

describe('ViewSvgComponent', () => {
  let component: ViewSvgComponent;
  let fixture: ComponentFixture<ViewSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
