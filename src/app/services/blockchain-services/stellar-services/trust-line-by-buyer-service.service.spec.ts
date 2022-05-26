import { TestBed } from '@angular/core/testing';

import { TrustLineByBuyerServiceService } from './trust-line-by-buyer-service.service';

describe('TrustLineByBuyerServiceService', () => {
  let service: TrustLineByBuyerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrustLineByBuyerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
