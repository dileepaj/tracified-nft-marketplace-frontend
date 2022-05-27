import { TestBed } from '@angular/core/testing';

import { EthereumMarketServiceService } from './ethereum-market-service.service';

describe('EthereumMarketServiceService', () => {
  let service: EthereumMarketServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EthereumMarketServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
