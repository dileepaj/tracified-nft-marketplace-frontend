import { TestBed } from '@angular/core/testing';

import { NftServicesService } from './nft-services.service';

describe('NftServicesService', () => {
  let service: NftServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NftServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
