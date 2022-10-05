import { TestBed } from '@angular/core/testing';

import { UserFAQService } from './user-faq.service';

describe('UserFAQService', () => {
  let service: UserFAQService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserFAQService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
