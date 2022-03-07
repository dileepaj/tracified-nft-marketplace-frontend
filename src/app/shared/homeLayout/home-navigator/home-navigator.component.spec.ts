import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeNavigatorComponent } from './home-navigator.component';

describe('HomeNavigatorComponent', () => {
  let component: HomeNavigatorComponent;
  let fixture: ComponentFixture<HomeNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeNavigatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
