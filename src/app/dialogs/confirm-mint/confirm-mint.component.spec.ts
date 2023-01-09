import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmMintComponent } from './confirm-mint.component';

describe('ConfirmMintComponent', () => {
  let component: ConfirmMintComponent;
  let fixture: ComponentFixture<ConfirmMintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmMintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmMintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
