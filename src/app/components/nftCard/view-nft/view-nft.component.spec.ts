import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNftComponent } from './view-nft.component';

describe('ViewNftComponent', () => {
  let component: ViewNftComponent;
  let fixture: ComponentFixture<ViewNftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewNftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewNftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
