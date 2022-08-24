import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowNFTComponent } from './show-nft.component';

describe('ShowNFTComponent', () => {
  let component: ShowNFTComponent;
  let fixture: ComponentFixture<ShowNFTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowNFTComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowNFTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
