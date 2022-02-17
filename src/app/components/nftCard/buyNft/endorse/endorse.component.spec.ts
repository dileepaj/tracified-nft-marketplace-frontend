import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndorseComponent } from './endorse.component';

describe('EndorseComponent', () => {
  let component: EndorseComponent;
  let fixture: ComponentFixture<EndorseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndorseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndorseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
