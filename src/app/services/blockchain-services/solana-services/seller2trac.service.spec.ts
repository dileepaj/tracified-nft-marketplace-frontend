import { TestBed } from '@angular/core/testing';

import { Seller2tracService } from './seller2trac.service';

describe('Seller2tracService', () => {
  let service: Seller2tracService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Seller2tracService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
