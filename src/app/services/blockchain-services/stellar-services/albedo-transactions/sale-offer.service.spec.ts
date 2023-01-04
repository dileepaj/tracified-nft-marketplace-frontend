import { TestBed } from '@angular/core/testing';

import { SaleOfferService } from './sale-offer.service';

describe('SaleOfferService', () => {
  let service: SaleOfferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaleOfferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
