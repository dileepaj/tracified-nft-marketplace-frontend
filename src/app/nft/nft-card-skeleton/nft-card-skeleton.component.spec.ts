import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftCardSkeletonComponent } from './nft-card-skeleton.component';

describe('NftCardSkeletonComponent', () => {
  let component: NftCardSkeletonComponent;
  let fixture: ComponentFixture<NftCardSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NftCardSkeletonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NftCardSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
