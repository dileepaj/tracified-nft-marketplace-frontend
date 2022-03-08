import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeNavbarLayoutComponent } from './home-navbar-layout.component';

describe('HomeNavbarLayoutComponent', () => {
  let component: HomeNavbarLayoutComponent;
  let fixture: ComponentFixture<HomeNavbarLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeNavbarLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeNavbarLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
