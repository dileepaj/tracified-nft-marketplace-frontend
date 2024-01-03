import { TestBed } from '@angular/core/testing';

import { DeviceTypeDetectorService } from './device-type-detector.service';

describe('DeviceTypeDetectorService', () => {
  let service: DeviceTypeDetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceTypeDetectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
