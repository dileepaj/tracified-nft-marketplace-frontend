import { TestBed } from '@angular/core/testing';

import { PubkeyvalidatorService } from './pubkeyvalidator.service';

describe('PubkeyvalidatorService', () => {
  let service: PubkeyvalidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PubkeyvalidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
