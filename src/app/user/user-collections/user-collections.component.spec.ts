import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCollectionsComponent } from './user-collections.component';

describe('UserCollectionsComponent', () => {
  let component: UserCollectionsComponent;
  let fixture: ComponentFixture<UserCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCollectionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
