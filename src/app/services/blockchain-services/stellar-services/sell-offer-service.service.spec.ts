import { TestBed } from '@angular/core/testing';

import { SellOfferServiceService } from './sell-offer-service.service';

describe('SellOfferServiceService', () => {
  let service: SellOfferServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SellOfferServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
