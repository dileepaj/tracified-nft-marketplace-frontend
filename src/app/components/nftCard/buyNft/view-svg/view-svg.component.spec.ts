import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSVGComponent } from './view-svg.component';

describe('ViewSVGComponent', () => {
  let component: ViewSVGComponent;
  let fixture: ComponentFixture<ViewSVGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSVGComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSVGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
