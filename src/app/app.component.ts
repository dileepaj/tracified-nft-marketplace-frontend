import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WalletSidenavService } from './services/wallet-sidenav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'tracified-nft-marketplace-frontend';
  public opened: boolean = false;
  public backTopVisible : boolean = false;
  constructor(private walletService: WalletSidenavService, private router: Router) {}

  ngOnInit() {
    this.walletService.getStatus().subscribe((val) => {
      this.opened = val;
    });
    window.addEventListener('scroll', () => {
      this.backTopVisible = window.pageYOffset !== 0;
    });
  }

  public goToTop() {
    window.scrollTo(0, 0);
  }

  public closeWalletSidenav() {
    this.walletService.close();
  }

}
