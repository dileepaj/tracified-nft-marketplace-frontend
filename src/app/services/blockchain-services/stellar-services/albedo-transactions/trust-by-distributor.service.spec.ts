import { TestBed } from '@angular/core/testing';

import { TrustByDistributorService } from './trust-by-distributor.service';

describe('TrustByDistributorService', () => {
  let service: TrustByDistributorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrustByDistributorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
