import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogViewerComponent } from './blog-viewer.component';

describe('BlogViewerComponent', () => {
  let component: BlogViewerComponent;
  let fixture: ComponentFixture<BlogViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
