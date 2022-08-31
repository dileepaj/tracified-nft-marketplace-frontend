import {
  Component,
  HostListener,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { WalletComponent } from 'src/app/wallet/wallet.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  private rect: any;
  sideNavOpened: boolean = false;

  constructor(private dialogref: MatDialog, private router: Router) {}

  ngOnInit(): void {}

  ngAfterViewChecked() {
    this.rect = document.getElementById('btnWallet')?.getBoundingClientRect();
  }

  openDialog(sidenav: boolean) {
    if (!sidenav) {
      this.dialogref.open(WalletComponent, {
        hasBackdrop: true,
        autoFocus: true,
        panelClass: 'popUpDialog',
        position: {
          right: `${this.rect.right - this.rect.left + this.rect.width * 2}px`,
          top: `${this.rect.bottom + 10}px`,
        },
      });
    } else {
      this.dialogref.open(WalletComponent, {
        hasBackdrop: true,
        autoFocus: true,
        panelClass: 'popUpDialog',
      });
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
  }

  public goToResource(route:any){
    if (route == "doc"){
      this.router.navigate(['/docs'], {
        queryParams: { data: 'Inside documentation' },
      });
    }else{
      this.router.navigate(['/faq'], {
        queryParams: { data:'Inside FAQs'},
      });
    }
  }

  public goToOverview(blockchain: string) {
    this.router.navigate(['/user-dashboard'], {
      queryParams: { blockchain: blockchain },
    });
  }
}
