import { TestBed } from '@angular/core/testing';

import { TransactionBuilderService } from './transaction-builder.service';

describe('TransactionBuilderService', () => {
  let service: TransactionBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
