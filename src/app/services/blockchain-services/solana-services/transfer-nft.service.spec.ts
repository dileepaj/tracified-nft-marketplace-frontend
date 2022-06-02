import { TestBed } from '@angular/core/testing';

import { TransferNftService } from './transfer-nft.service';

describe('TransferNftService', () => {
  let service: TransferNftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferNftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
