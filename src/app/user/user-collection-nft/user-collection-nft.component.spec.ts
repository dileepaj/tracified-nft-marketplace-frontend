import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCollectionNFTComponent } from './user-collection-nft.component';

describe('UserCollectionNFTComponent', () => {
  let component: UserCollectionNFTComponent;
  let fixture: ComponentFixture<UserCollectionNFTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCollectionNFTComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCollectionNFTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
