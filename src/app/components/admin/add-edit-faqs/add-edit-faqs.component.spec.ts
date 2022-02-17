import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFaqsComponent } from './add-edit-faqs.component';

describe('AddEditFaqsComponent', () => {
  let component: AddEditFaqsComponent;
  let fixture: ComponentFixture<AddEditFaqsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditFaqsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditFaqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
