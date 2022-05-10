import { TestBed } from '@angular/core/testing';

import { GetAssociatedTokenAccountService } from './get-associated-token-account.service';

describe('GetAssociatedTokenAccountService', () => {
  let service: GetAssociatedTokenAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetAssociatedTokenAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
