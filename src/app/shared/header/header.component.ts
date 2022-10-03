import {
  Component,
  HostListener,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/services/dialog-services/dialog.service';
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
  accListExpanded: boolean = false;
  tag: any;
  controlGroup: FormGroup;
  bcListExpanded: boolean = false;
  accListExpanded: boolean = false;
  timedOutCloser;
  
  constructor(
    private dialogref: MatDialog,
    private router: Router,
    public loaderService: LoaderService,
    private walletService: WalletSidenavService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    //this.openDialogTest();
    this.controlGroup = new FormGroup({
      //validation
      Tag: new FormControl(this.tag, Validators.required),
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
    this.router.navigate(['/explore'], {
      queryParams: { blockchain: blockchain, filter: 'all' },
    });
    this.sideNavOpened = false;
    this.bcListExpanded = false;
  }

  public search() {
    const tag = this.formValue('Tag');
    console.log('tags :', tag);
    this.router.navigate(['/shownft'], {
      queryParams: { data: tag },
    });
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
    this.router.navigate(['/user-dashboard/overview'], {
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

  private openDialogTest() {
    /* this.dialogService.okDialog({
      title: 'User review confirmation',
      message: 'Are you sure you want to submit this review',
      confirmText: 'Yes',
    }); */

    this.dialogService.pendingDialog();
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
}
