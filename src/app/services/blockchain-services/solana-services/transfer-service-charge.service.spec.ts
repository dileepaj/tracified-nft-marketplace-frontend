import { TestBed } from '@angular/core/testing';

import { TransferServiceChargeService } from './transfer-service-charge.service';

describe('TransferServiceChargeService', () => {
  let service: TransferServiceChargeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferServiceChargeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
