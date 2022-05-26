import { TestBed } from '@angular/core/testing';

import { BuyNftServiceService } from './buy-nft-service.service';

describe('BuyNftServiceService', () => {
  let service: BuyNftServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuyNftServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
