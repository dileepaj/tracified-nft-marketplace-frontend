import { TestBed } from '@angular/core/testing';

import { MatrixViewService } from './matrix-view.service';

describe('MatrixViewService', () => {
  let service: MatrixViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatrixViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
