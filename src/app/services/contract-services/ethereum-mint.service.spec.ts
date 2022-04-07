import { TestBed } from '@angular/core/testing';

import { EthereumMintService } from './ethereum-mint.service';

describe('EthereumMintService', () => {
  let service: EthereumMintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EthereumMintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
