import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftgridComponent } from './nftgrid.component';

describe('NftgridComponent', () => {
  let component: NftgridComponent;
  let fixture: ComponentFixture<NftgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NftgridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NftgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
