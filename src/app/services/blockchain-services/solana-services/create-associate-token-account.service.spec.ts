import { TestBed } from '@angular/core/testing';

import { CreateAssociateTokenAccountService } from './create-associate-token-account.service';

describe('CreateAssociateTokenAccountService', () => {
  let service: CreateAssociateTokenAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateAssociateTokenAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
