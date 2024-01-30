import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeVisibilityDialogComponent } from './change-visibility-dialog.component';

describe('ChangeVisibilityDialogComponent', () => {
  let component: ChangeVisibilityDialogComponent;
  let fixture: ComponentFixture<ChangeVisibilityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeVisibilityDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeVisibilityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
