import { TestBed } from '@angular/core/testing';

import { PolygonMintService } from './polygon-mint.service';

describe('PolygonMintService', () => {
  let service: PolygonMintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolygonMintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
