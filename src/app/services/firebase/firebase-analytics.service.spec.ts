import { TestBed } from '@angular/core/testing';

import { FirebaseAnalyticsService } from './firebase-analytics.service';

describe('FirebaseAnalyticsService', () => {
  let service: FirebaseAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
