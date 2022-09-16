import { TestBed } from '@angular/core/testing';

import { WalletSidenavService } from './wallet-sidenav.service';

describe('WalletSidenavService', () => {
  let service: WalletSidenavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletSidenavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
