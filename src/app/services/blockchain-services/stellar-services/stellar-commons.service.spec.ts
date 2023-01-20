import { TestBed } from '@angular/core/testing';

import { StellarCommonsService } from './stellar-commons.service';

describe('StellarCommonsService', () => {
  let service: StellarCommonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StellarCommonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
