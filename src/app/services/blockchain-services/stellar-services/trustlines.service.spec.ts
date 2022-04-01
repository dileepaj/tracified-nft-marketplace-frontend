import { TestBed } from '@angular/core/testing';

import { TrustlinesService } from './trustlines.service';

describe('TrustlinesService', () => {
  let service: TrustlinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrustlinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
