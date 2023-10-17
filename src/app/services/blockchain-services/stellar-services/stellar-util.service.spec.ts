import { TestBed } from '@angular/core/testing';

import { StellarUtilService } from './stellar-util.service';

describe('StellarUtilService', () => {
  let service: StellarUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StellarUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
