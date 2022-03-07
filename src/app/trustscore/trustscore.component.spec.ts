import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustscoreComponent } from './trustscore.component';

describe('TrustscoreComponent', () => {
  let component: TrustscoreComponent;
  let fixture: ComponentFixture<TrustscoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrustscoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrustscoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
