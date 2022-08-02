import { TestBed } from '@angular/core/testing';

import { AdminAPIServiceService } from './admin-apiservice.service';

describe('AdminAPIServiceService', () => {
  let service: AdminAPIServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminAPIServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
