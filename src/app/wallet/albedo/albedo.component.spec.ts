import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbedoComponent } from './albedo.component';

describe('AlbedoComponent', () => {
  let component: AlbedoComponent;
  let fixture: ComponentFixture<AlbedoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlbedoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbedoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
