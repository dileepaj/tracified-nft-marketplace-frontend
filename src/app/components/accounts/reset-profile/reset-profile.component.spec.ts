import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetProfileComponent } from './reset-profile.component';

describe('ResetProfileComponent', () => {
  let component: ResetProfileComponent;
  let fixture: ComponentFixture<ResetProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
