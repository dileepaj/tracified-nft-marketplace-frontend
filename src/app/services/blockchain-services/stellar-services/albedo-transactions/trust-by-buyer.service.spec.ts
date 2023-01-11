import { TestBed } from '@angular/core/testing';

import { TrustByBuyerService } from './trust-by-buyer.service';

describe('TrustByBuyerService', () => {
  let service: TrustByBuyerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrustByBuyerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
