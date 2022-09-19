import {
  Component,
  HostListener,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { WalletSidenavService } from 'src/app/services/wallet-sidenav.service';
import { WalletComponent } from 'src/app/wallet/wallet.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  private rect: any;
  sideNavOpened: boolean = false;
  bcListExpanded: boolean = false;
  accListExpanded: boolean = false;

  constructor(
    private dialogref: MatDialog,
    private router: Router,
    public loaderService: LoaderService,
    private walletService: WalletSidenavService
  ) {}

  ngOnInit(): void {}

  ngAfterViewChecked() {
    this.rect = document.getElementById('btnWallet')?.getBoundingClientRect();
  }

  openDialog(sidenav: boolean) {
    if (!sidenav) {
      this.walletService.open();
      /*  this.dialogref.open(WalletComponent, {
        hasBackdrop: true,
        autoFocus: true,
        panelClass: 'popUpDialog',
        position: {
          right: `${this.rect.right - this.rect.left + this.rect.width * 2}px`,
          top: `${this.rect.bottom + 10}px`,
        },
      }); */
    } else {
      this.sideNavOpened = false;
      this.walletService.open();
      /* this.dialogref.open(WalletComponent, {
        hasBackdrop: true,
        autoFocus: true,
        panelClass: 'popUpDialog',
      }); */
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    let element = document.getElementById('navbar') as HTMLElement;
    if (window.pageYOffset > element.clientHeight) {
      element.classList.add('header-colored');
    } else {
      element.classList.remove('header-colored');
    }
  }

  public openSideNav() {
    this.sideNavOpened = true;
  }

  public closeSideNav() {
    this.sideNavOpened = false;
  }

  public checkPath(): string {
    return this.router.url.split('?')[0];
  }

  public goToExplore(blockchain: string) {
    this.router.navigate(['/explore'], {
      queryParams: { blockchain: blockchain, filter: 'all' },
    });
    this.sideNavOpened = false;
    this.bcListExpanded = false;
  }

  public goToResource(route: any) {
    if (route == 'doc') {
      this.router.navigate(['/docs'], {
        queryParams: { data: 'Inside documentation' },
      });
    } else {
      this.router.navigate(['/faq'], {
        queryParams: { data: 'Inside FAQs' },
      });
    }
    this.sideNavOpened = false;
  }

  public goToOverview(blockchain: string) {
    this.router.navigate(['/user-dashboard'], {
      queryParams: { blockchain: blockchain },
    });
    this.sideNavOpened = false;
    this.accListExpanded = false;
  }

  public goToHome() {
    this.router.navigate(['/home']);
  }

  public toggleBcList() {
    this.bcListExpanded = !this.bcListExpanded;
  }

  public toggleAccList() {
    this.accListExpanded = !this.accListExpanded;
  }
}
