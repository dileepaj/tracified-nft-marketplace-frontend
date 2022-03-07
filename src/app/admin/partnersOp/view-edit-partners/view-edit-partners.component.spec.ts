import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditPartnersComponent } from './view-edit-partners.component';

describe('ViewEditPartnersComponent', () => {
  let component: ViewEditPartnersComponent;
  let fixture: ComponentFixture<ViewEditPartnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEditPartnersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEditPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
