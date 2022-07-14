import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndorsementsComponent } from './endorsements.component';

describe('EndorsementsComponent', () => {
  let component: EndorsementsComponent;
  let fixture: ComponentFixture<EndorsementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndorsementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndorsementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
