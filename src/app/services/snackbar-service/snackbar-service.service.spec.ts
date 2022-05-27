import { TestBed } from '@angular/core/testing';

import { SnackbarServiceService } from './snackbar-service.service';

describe('SnackbarServiceService', () => {
  let service: SnackbarServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnackbarServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
