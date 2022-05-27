import { TestBed } from '@angular/core/testing';

import { PolygonMarketServiceService } from './polygon-market-service.service';

describe('PolygonMarketServiceService', () => {
  let service: PolygonMarketServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolygonMarketServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
