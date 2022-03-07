import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNftReviewComponent } from './add-nft-review.component';

describe('AddNftReviewComponent', () => {
  let component: AddNftReviewComponent;
  let fixture: ComponentFixture<AddNftReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNftReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNftReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
