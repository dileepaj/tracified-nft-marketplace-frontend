import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseMarketplaceComponent } from './browse-marketplace.component';

describe('BrowseMarketplaceComponent', () => {
  let component: BrowseMarketplaceComponent;
  let fixture: ComponentFixture<BrowseMarketplaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseMarketplaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseMarketplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
