import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNftCardComponent } from './view-nft-card.component';

describe('ViewNftCardComponent', () => {
  let component: ViewNftCardComponent;
  let fixture: ComponentFixture<ViewNftCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewNftCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewNftCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
