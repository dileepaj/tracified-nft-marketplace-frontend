import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditNewsletterComponent } from './view-edit-newsletter.component';

describe('ViewEditNewsletterComponent', () => {
  let component: ViewEditNewsletterComponent;
  let fixture: ComponentFixture<ViewEditNewsletterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEditNewsletterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEditNewsletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
