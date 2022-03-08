import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNavbarLayoutComponent } from './admin-navbar-layout.component';

describe('AdminNavbarLayoutComponent', () => {
  let component: AdminNavbarLayoutComponent;
  let fixture: ComponentFixture<AdminNavbarLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminNavbarLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNavbarLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
