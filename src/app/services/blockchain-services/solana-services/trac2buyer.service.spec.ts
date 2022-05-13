import { TestBed } from '@angular/core/testing';

import { Trac2buyerService } from './trac2buyer.service';

describe('Trac2buyerService', () => {
  let service: Trac2buyerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Trac2buyerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
