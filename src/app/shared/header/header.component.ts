import albedo from '@albedo-link/intent';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserWallet } from 'src/app/models/userwallet';
import { DialogService } from 'src/app/services/dialog-services/dialog.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { WalletSidenavService } from 'src/app/services/wallet-sidenav.service';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';
import { WalletComponent } from 'src/app/wallet/wallet.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('sidenav', { read: ElementRef, static: false })
  sideBarContainer: ElementRef;
  private rect: any;
  sideNavOpened: boolean = false;
  accListExpanded: boolean = false;
  tag: any;
  controlGroup: FormGroup;
  sideBarControlGroup: FormGroup;
  bcListExpanded: boolean = false;
  resourcesExpanded: boolean = false;
  timedOutCloser;
  tx: any;
  User: string;

  constructor(
    private dialogref: MatDialog,
    private router: Router,
    public loaderService: LoaderService,
    private walletService: WalletSidenavService,
    private dialogService: DialogService,
    private snackBar: SnackbarServiceService,
  ) {}

  ngOnInit(): void {
    //this.openDialogTest();
    this.controlGroup = new FormGroup({
      //validation
      Tag: new FormControl(this.tag, Validators.required),
    });
    this.sideBarControlGroup = new FormGroup({
      SideBarTag: new FormControl(this.tag, Validators.required),
    });
  }

  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }

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
    this.router
      .navigate(['/explore'], {
        queryParams: { blockchain: blockchain, filter: 'all' },
      })
      .then((res) => {
        window.location.reload();
      });
    this.sideNavOpened = false;
    this.bcListExpanded = false;
  }

  public search() {
    const tag = this.formValue('Tag');
    if (tag !== '') {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/shownft'], {
          queryParams: { data: tag },
        });
      });
    }
  }

  public searchSideBar() {
    const tag = this.sideBarControlGroup.get('SideBarTag')!.value;
    if (tag !== '') {
      this.closeSideNav();
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/shownft'], {
          queryParams: { data: tag },
        });
      });
    }
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

  public async goToOverview(blockchain: string) {
    if (blockchain == 'stellar') {
      let details = navigator.userAgent;

      let regexp = /android|iphone|kindle|ipad/i;

      let isMobileDevice = await regexp.test(details);

      if (isMobileDevice) {
        await albedo.publicKey({ require_existing: true }).then((re1s: any) => {
          this.tx = re1s;
          this.router.navigate(['/user-dashboard/overview'], {
            queryParams: { user: this.tx.pubkey, blockchain: blockchain },
          });

          this.sideNavOpened = false;
          this.accListExpanded = false;
        });
      } else {
        let freighterWallet = new UserWallet();
        freighterWallet = new FreighterComponent(freighterWallet);
        await freighterWallet.initWallelt();
        this.User = await freighterWallet.getWalletaddress();

        this.router.navigate(['/user-dashboard/overview'], {
          queryParams: { user: this.User, blockchain: blockchain },
        });
        this.sideNavOpened = false;
        this.accListExpanded = false;
      }
    } else if (blockchain == 'solana') {
      // this.snackBar.openSnackBar("Solana NFTs coming soon!","info");
      // return
      let phantomWallet = new UserWallet();
      phantomWallet = new PhantomComponent(phantomWallet);
      await phantomWallet.initWallelt();
      this.User = await phantomWallet.getWalletaddress();

      this.router.navigate(['/user-dashboard/overview'], {
        queryParams: { user: this.User, blockchain: blockchain },
      });
      this.sideNavOpened = false;
      this.accListExpanded = false;
    } else if (blockchain == 'ethereum' || blockchain == 'polygon') {
      // this.snackBar.openSnackBar("Ethereum and Polygon NFTs coming soon!","info");
      // return
      let metamaskwallet = new UserWallet();
      metamaskwallet = new MetamaskComponent(metamaskwallet);
      await metamaskwallet.initWallelt();
      this.User = await metamaskwallet.getWalletaddress();

      this.router.navigate(['/user-dashboard/overview'], {
        queryParams: { user: this.User, blockchain: blockchain },
      });
      this.sideNavOpened = false;
      this.accListExpanded = false;
    }
  }

  public goToHome() {
    this.router.navigate(['/']);
  }

  public toggleBcList() {
    this.bcListExpanded = !this.bcListExpanded;
  }

  public toggleAccList() {
    this.accListExpanded = !this.accListExpanded;
  }

  public toggleResources() {
    this.resourcesExpanded = !this.resourcesExpanded;
  }
  private openDialogTest() {
    /* this.dialogService.okDialog({
      title: 'User review confirmation',
      message: 'Are you sure you want to submit this review',
      confirmText: 'Yes',
    }); */

    this.dialogService.pendingDialog({ message: 'Loading Contents..' });
  }

  mouseEnter(trigger) {
    if (this.timedOutCloser) {
      clearTimeout(this.timedOutCloser);
    }
    trigger.openMenu();
  }

  mouseLeave(trigger) {
    this.timedOutCloser = setTimeout(() => {
      trigger.closeMenu();
    }, 50);
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    try {
      if (this.sideNavOpened) {
        if (
          !this.sideBarContainer.nativeElement.contains(event.target) &&
          event.target.id !== 'menu-icon'
        ) {
          this.closeSideNav();
        }
      }
    } catch (e) {
      //do something
    }
  }
}
