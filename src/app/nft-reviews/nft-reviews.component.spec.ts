import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftReviewsComponent } from './nft-reviews.component';

describe('NftReviewsComponent', () => {
  let component: NftReviewsComponent;
  let fixture: ComponentFixture<NftReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NftReviewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NftReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
